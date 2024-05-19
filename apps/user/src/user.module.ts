import { Module } from "@nestjs/common";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "@app/shared";
import { APP_FILTER } from "@nestjs/core";
import { GrpcServerExceptionFilter } from "nestjs-grpc-exceptions";
import { Post } from "@app/shared/entities/post";
import { Comment } from "@app/shared/entities/comment";

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: ".env" }),
    TypeOrmModule.forRoot({
      type: "postgres",
      synchronize: true,
      entities: [User, Post, Comment],
      url: process.env.POSTGRES_URL,
    }),
    TypeOrmModule.forFeature([User]),
  ],
  controllers: [UserController],
  providers: [
    UserService,
    {
      provide: APP_FILTER,
      useClass: GrpcServerExceptionFilter,
    },
  ],
})
export class UserModule {}
