import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Comment, Post, User } from "@app/shared";
import { Repository } from "typeorm";
import {
  GrpcInvalidArgumentException,
  GrpcNotFoundException,
} from "nestjs-grpc-exceptions";
import { SuccessResponse } from "@app/shared/interfaces/successResponse";
import {
  CreateRequest,
  UpdateRequest,
} from "@app/shared/interfaces/postService";
import { ProtoInt } from "@app/shared/interfaces/protoInt";

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post) private postRepository: Repository<Post>,
    @InjectRepository(Comment) private commentRepository: Repository<Comment>,
    @InjectRepository(User) private userRepository: Repository<User>
  ) {}

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
    const postsComments: Comment[] = await this.getPostsComments(post.postId);
    if (!post) {
      throw new GrpcNotFoundException("Post not found");
    }
    return { ...post, comments: postsComments ? postsComments : [] };
  }

  async getPostByAuthor(id: number) {
    const posts = await this.postRepository.find({
      where: { author: { id } },
      relations: ["author", "comments"],
    });
    return { posts };
  }

  async createPost(
    data: CreateRequest & { author: { id: ProtoInt } }
  ): Promise<SuccessResponse> {
    const user = await this.userRepository.findOne({
      where: { id: data.author.id.low },
    });
    if (!user) {
      throw new GrpcNotFoundException("User not found");
    }
    const post = this.postRepository.create({ ...data, author: user });
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

  async getPostsComments(id: number): Promise<Comment[]> {
    const postsComments: Comment[] | null = await this.commentRepository.find({
      where: { post: { postId: id } },
      relations: ["author"],
    });
    return postsComments;
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
}
