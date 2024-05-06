import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Post } from "@app/shared";
import { Repository } from "typeorm";
import { GrpcInvalidArgumentException } from "nestjs-grpc-exceptions";

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post) private postRepository: Repository<Post>
  ) {}

  async getPosts(page: number): Promise<{ posts: Post[] }> {
    if (page <= 0) {
      throw new GrpcInvalidArgumentException("Page cant'be 0 or less");
    }
    const posts = await this.postRepository.find({ relations: ["author"] });
    console.log(posts);
    return {
      posts: posts.map((post) => ({
        ...post,
        author: null,
        authorId: post.author.id,
      })),
    };
  }
}
