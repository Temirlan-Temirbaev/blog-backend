import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "@app/shared";
import { APP_FILTER } from "@nestjs/core";
import { GrpcServerExceptionFilter } from "nestjs-grpc-exceptions";
import { Post } from "@app/shared/entities/post";
import { Comment } from "@app/shared/entities/comment";
import { PostService } from "./post.service";
import { PostController } from "./post.controller";

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: ".env" }),
    TypeOrmModule.forRoot({
      type: "postgres",
      synchronize: true,
      entities: [User, Post, Comment],
      url: "postgresql://postgres:foofie213@127.0.0.1:5432/blog",
    }),
    TypeOrmModule.forFeature([Post]),
  ],
  controllers: [PostController],
  providers: [
    PostService,
    {
      provide: APP_FILTER,
      useClass: GrpcServerExceptionFilter,
    },
  ],
})
export class PostModule {}
