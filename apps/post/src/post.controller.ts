import { Controller, Get } from "@nestjs/common";
import { PostService } from "./post.service";
import { GrpcMethod } from "@nestjs/microservices";
import { ProtoInt } from "@app/shared/interfaces/protoInt";
import { Post } from "@app/shared";

@Controller()
export class PostController {
  constructor(private postService: PostService) {}

  @GrpcMethod("PostService", "GetPosts")
  async getPosts(data: { page: ProtoInt }) {
    return await this.postService.getPosts(data.page.low);
  }
}
