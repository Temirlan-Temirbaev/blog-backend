import { Comment } from "../entities/comment";
import { SuccessResponse } from "./successResponse";

export interface CommentService {
  CreateComment: (data: CreateCommentRequest) => Promise<Comment>;
  UpdateComment: (data: UpdateCommentRequest) => Promise<SuccessResponse>;
  DeleteComment: (data: DeleteCommentRequest) => Promise<SuccessResponse>;
}

export interface CreateCommentRequest {
  author: { id: number };
  postId: number;
  content: string;
}

export type UpdateCommentRequest = {
  commentId: number;
} & CreateCommentRequest;

export interface DeleteCommentRequest {
  postId: number;
  author: { id: number };
  commentId: number;
}
