import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User, Post, Comment, PostgresModule } from "@app/shared";
import { APP_FILTER } from "@nestjs/core";
import { GrpcServerExceptionFilter } from "nestjs-grpc-exceptions";
import { PostService } from "./post.service";
import { PostController } from "./post.controller";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { join } from "path";

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: ".env" }),
    PostgresModule,
    TypeOrmModule.forFeature([Post, Comment, User]),
    ClientsModule.register([
      {
        name: "USER_SERVICE",
        transport: Transport.GRPC,
        options: {
          package: "user",
          protoPath: join(__dirname, "../../../proto/user.proto"),
          url: "user:2001",
        },
      },
      {
        name: "COMMENT_SERVICE",
        transport: Transport.GRPC,
        options: {
          package: "comment",
          protoPath: join(__dirname, "../../../proto/comment.proto"),
          url: "comment:3001",
        },
      },
      {
        name: "IMAGE_SERVICE",
        transport: Transport.GRPC,
        options: {
          package: "image",
          protoPath: join(__dirname, "../../../proto/image.proto"),
          url: "image:9001",
        },
      },
    ]),
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
