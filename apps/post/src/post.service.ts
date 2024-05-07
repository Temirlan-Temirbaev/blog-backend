import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Comment, Post, User } from "@app/shared";
import { Repository } from "typeorm";
import {
  GrpcInvalidArgumentException,
  GrpcNotFoundException,
} from "nestjs-grpc-exceptions";
import { SuccessResponse } from "@app/shared/interfaces/successResponse";
import { CreateRequest } from "@app/shared/interfaces/postService";
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
    const postsComments: Comment[] | null = await this.commentRepository.find({
      where: { post: { postId: id } },
      relations: ["author"],
    });
    if (!post) {
      throw new GrpcNotFoundException("Post not found");
    }
    return { ...post, comments: postsComments ? postsComments : [] };
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
    await this.userRepository.save(user);

    return { success: true };
  }
}
