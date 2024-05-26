import { Controller } from "@nestjs/common";
import { CommentService } from "./comment.service";
import { GrpcMethod } from "@nestjs/microservices";
import {
  CreateCommentRequest,
  DeleteCommentRequest,
  UpdateCommentRequest,
  ProtoInt,
} from "@app/shared";

@Controller()
export class CommentController {
  constructor(private commentService: CommentService) {}

  @GrpcMethod("CommentService", "CreateComment")
  async createComment(
    data: CreateCommentRequest & { author: { id: ProtoInt }; postId: ProtoInt }
  ) {
    return this.commentService.createComment(data);
  }
  @GrpcMethod("CommentService", "DeleteComment")
  async deleteComment(
    data: DeleteCommentRequest & {
      author: { id: ProtoInt };
      commentId: ProtoInt;
    }
  ) {
    return this.commentService.deleteComment(data);
  }
  @GrpcMethod("CommentService", "UpdateComment")
  async updateComment(
    data: UpdateCommentRequest & {
      author: { id: ProtoInt };
      commentId: ProtoInt;
    }
  ) {
    return this.commentService.updateComment(data);
  }

  @GrpcMethod("CommentService", "GetCommentsByPostId")
  async getCommentsByPostId(data: { postId: ProtoInt }) {
    console.log(data);

    return this.commentService.getCommentsByPostId(data.postId);
  }
}
