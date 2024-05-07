import { Post } from "../entities/post";
import { SuccessResponse } from "./successResponse";

export interface PostService {
  Create: (body: CreateRequest) => Promise<Post>;
  Delete: (body: DeleteRequest) => Promise<SuccessResponse>;
  Update: (body: UpdateRequest) => Promise<SuccessResponse>;
  GetPosts: (body: GetPostsRequest) => Promise<Post[]>;
  GetPostById: (body: GetPostByIdRequest) => Promise<Post>;
  GetPostsByAuthorId: (body: GetPostByIdRequest) => Promise<Post[]>;
}

export interface CreateRequest {
  author: { id: number };
  title: string;
  description: string;
}

export interface DeleteRequest {
  authorId: number;
  postId: number;
}

export interface UpdateRequest {
  userId: number;
  title: string;
  description: string;
}

export interface GetPostsRequest {
  page: number;
}

export interface GetPostByIdRequest {
  id: number;
}
