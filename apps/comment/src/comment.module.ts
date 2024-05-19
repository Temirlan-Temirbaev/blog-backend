import { Module } from "@nestjs/common";
import { CommentController } from "./comment.controller";
import { CommentService } from "./comment.service";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User, Post, Comment } from "@app/shared";

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: ".env" }),
    TypeOrmModule.forRoot({
      type: "postgres",
      synchronize: true,
      entities: [User, Post, Comment],
      url: process.env.POSTGRES_URL,
    }),
    TypeOrmModule.forFeature([Post, Comment, User]),
  ],
  controllers: [CommentController],
  providers: [CommentService],
})
export class CommentModule {}
