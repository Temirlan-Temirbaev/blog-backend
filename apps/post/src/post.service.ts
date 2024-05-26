import { Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Brackets, Like, Repository } from "typeorm";
import {
  GrpcInvalidArgumentException,
  GrpcNotFoundException,
} from "nestjs-grpc-exceptions";
import {
  CreateRequest,
  UpdateRequest,
  ProtoInt,
  SuccessResponse,
  Comment,
  Post,
  User,
  UserService,
  CommentService,
  GetPostsByContentRequest,
} from "@app/shared";
import { ClientGrpc } from "@nestjs/microservices";
import { lastValueFrom } from "rxjs";

@Injectable()
export class PostService {
  private userService: UserService;
  private commentService: CommentService;
  constructor(
    @InjectRepository(Post) private postRepository: Repository<Post>,
    @Inject("USER_SERVICE") private userClient: ClientGrpc,
    @Inject("COMMENT_SERVICE") private commentClient: ClientGrpc
  ) {}

  onModuleInit() {
    this.userService = this.userClient.getService<UserService>("UserService");
    this.commentService =
      this.commentClient.getService<CommentService>("CommentService");
  }

  async getPosts(page: number): Promise<{ posts: Post[] }> {
    if (page <= 0) {
      throw new GrpcInvalidArgumentException("Page cant'be 0 or less");
    }
    const posts = await this.postRepository.find({
      relations: ["author"],
      order: { createdAt: "DESC" },
      take: page * 10,
    });
    return { posts };
  }

  async getPostById(id: number): Promise<Post> {
    const post = await this.postRepository.findOne({
      relations: ["author"],
      where: { postId: id },
    });
    const commentsObservable = this.commentService.GetCommentsByPostId({
      postId: post.postId,
    });
    const { comments }: { comments: Comment[] } = await lastValueFrom(
      // @ts-ignore
      commentsObservable
    );
    if (!post) {
      throw new GrpcNotFoundException("Post not found");
    }
    return {
      ...post,
      comments,
    };
  }

  async getPostByAuthor(id: number) {
    const posts = await this.postRepository.find({
      where: { author: { id } },
      order: {
        createdAt: "DESC",
      },
    });

    return { posts };
  }

  async createPost(
    data: CreateRequest & { author: { id: ProtoInt } }
  ): Promise<SuccessResponse> {
    const userObservable = this.userService.GetUserById({
      id: data.author.id.low,
    });
    // @ts-ignore
    const user: User = await lastValueFrom(userObservable);
    if (!user) {
      throw new GrpcNotFoundException("User not found");
    }
    const post = this.postRepository.create({
      ...data,
      author: { ...user, id: data.author.id.low },
    });
    await this.postRepository.save(post);
    return { success: true };
  }

  async deletePost(data: {
    authorId: ProtoInt;
    postId: ProtoInt;
  }): Promise<SuccessResponse> {
    const post = await this.postRepository.findOneBy({
      postId: data.postId.low,
      author: { id: data.authorId.low },
    });
    if (!post) {
      throw new GrpcNotFoundException("Post not found");
    }
    await this.postRepository.delete(post);
    return { success: true };
  }

  async UpdatePost(
    data: UpdateRequest & { author: { id: ProtoInt } }
  ): Promise<SuccessResponse> {
    const post = await this.postRepository.findOneBy({
      postId: data.postId,
      author: { id: data.author.id.low },
    });
    if (!post) {
      throw new GrpcNotFoundException("Post not found");
    }

    Object.assign(post, { title: data.title, description: data.description });
    post.updatedAt = new Date();
    await this.postRepository.save(post);
    return { success: true };
  }

  async getPostsByContent(data: GetPostsByContentRequest) {
    const posts = await this.postRepository
      .createQueryBuilder("post")
      .leftJoinAndSelect("post.author", "author")
      .andWhere(
        new Brackets((qb) => {
          qb.where("post.title LIKE :like", {
            like: `%${data.title}%`,
          }).orWhere("post.description LIKE :description", {
            description: `%${data.description}%`,
          });
        })
      )
      .orderBy("post.createdAt", "DESC")
      .getMany();
    return { posts };
  }
}
