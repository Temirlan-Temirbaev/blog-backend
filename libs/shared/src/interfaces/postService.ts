import { Post } from "../entities/post";
import { SuccessResponse } from "./successResponse";
import { Observable } from "rxjs";

export interface PostService {
  Create: (body: CreateRequest) => Promise<Post>;
  Delete: (body: DeleteRequest) => Promise<SuccessResponse>;
  Update: (body: UpdateRequest) => Promise<SuccessResponse>;
  GetPosts: (body: GetPostsRequest) => Observable<Post[]>;
  GetPostById: (body: GetPostByIdRequest) => Observable<Post>;
  GetPostsByAuthorId: (body: GetPostByIdRequest) => Promise<Post[]>;
  GetPostsByContent: (body: GetPostsByContentRequest) => Promise<Post[]>;
}

export interface CreateRequest {
  author: { id: number };
  title: string;
  description: string;
  file?: Uint8Array;
}

export interface DeleteRequest {
  authorId: number;
  postId: number;
}

export interface UpdateRequest {
  author: { id: number };
  title: string;
  description: string;
  postId: number;
  file?: Uint8Array;
}

export interface GetPostsRequest {
  page: number;
}

export interface GetPostByIdRequest {
  id: number;
}

export interface GetPostsByContentRequest {
  title?: string;
  description?: string;
}
