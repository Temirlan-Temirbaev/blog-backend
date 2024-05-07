import { Controller } from "@nestjs/common";
import { PostService } from "./post.service";
import { GrpcMethod } from "@nestjs/microservices";
import { ProtoInt } from "@app/shared/interfaces/protoInt";
import { Post } from "@app/shared";

@Controller()
export class PostController {
  constructor(private postService: PostService) {}

  @GrpcMethod("PostService", "GetPosts")
  async getPosts(data: { page: ProtoInt }): Promise<{ posts: Post[] }> {
    return await this.postService.getPosts(data.page.low);
  }

  @GrpcMethod("PostService", "GetPostById")
  async getPostById(data: { id: ProtoInt }): Promise<Post> {
    return await this.postService.getPostById(data.id.low);
  }
}
