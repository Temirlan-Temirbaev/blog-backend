import { Comment } from "../entities/comment";
import { SuccessResponse } from "./successResponse";

export interface CommentService {
  GetCommentsByPostId: (data: GetCommentsByPostIdRequest) => Promise<Comment[]>;
  CreateComment: (data: CreateCommentRequest) => Promise<Comment>;
  UpdateComment: (data: UpdateCommentRequest) => Promise<SuccessResponse>;
  DeleteComment: (data: DeleteCommentRequest) => Promise<SuccessResponse>;
}

export interface GetCommentsByPostIdRequest {
  postId: number;
}

export interface CreateCommentRequest {
  author: { id: number };
  postId: number;
  content: string;
}

export type UpdateCommentRequest = {
  commentId: number;
} & Omit<CreateCommentRequest, "postId">;

export interface DeleteCommentRequest {
  author: { id: number };
  commentId: number;
}
