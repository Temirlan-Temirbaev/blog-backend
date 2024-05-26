import {
  CreateCommentRequest,
  DeleteCommentRequest,
  UpdateCommentRequest,
  ProtoInt,
  SuccessResponse,
  Post,
  User,
  Comment,
} from "@app/shared";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { GrpcNotFoundException } from "nestjs-grpc-exceptions";
import { Repository } from "typeorm";

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment) private commentRepository: Repository<Comment>,
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Post) private postRepository: Repository<Post>
  ) {}

  async createComment(
    data: CreateCommentRequest & { author: { id: ProtoInt }; postId: ProtoInt }
  ): Promise<Comment> {
    const user = await this.userRepository.findOneBy({
      id: data.author.id.low,
    });
    if (!user) {
      throw new GrpcNotFoundException("User not found");
    }

    const post = await this.postRepository.findOneBy({
      postId: data.postId.low,
    });

    if (!post) {
      throw new GrpcNotFoundException("Post not found");
    }

    const comment = this.commentRepository.create({
      content: data.content,
      author: user,
      post: post,
    });
    return await this.commentRepository.save(comment);
  }

  async deleteComment(
    data: DeleteCommentRequest & {
      commentId: ProtoInt;
      author: { id: ProtoInt };
    }
  ): Promise<SuccessResponse> {
    const comment = await this.commentRepository.findOne({
      where: {
        commentId: data.commentId.low,
        author: { id: data.author.id.low },
      },
      relations: ["author", "post"],
    });
    if (!comment) {
      throw new GrpcNotFoundException("Comment not found");
    }
    await this.commentRepository.remove(comment);
    return { success: true };
  }

  async updateComment(
    data: UpdateCommentRequest & {
      author: { id: ProtoInt };
      commentId: ProtoInt;
    }
  ): Promise<SuccessResponse> {
    const comment = await this.commentRepository.findOneBy({
      commentId: data.commentId.low,
      author: { id: data.author.id.low },
    });
    if (!comment) {
      throw new GrpcNotFoundException("Comment not found");
    }
    comment.content = data.content;
    await this.commentRepository.save(comment);
    return {
      success: true,
    };
  }

  async getCommentsByPostId(id: ProtoInt): Promise<{ comments: Comment[] }> {
    const comments = await this.commentRepository.find({
      where: { post: { postId: id.low } },
      relations: ["author"],
    });
    return { comments };
  }
}
