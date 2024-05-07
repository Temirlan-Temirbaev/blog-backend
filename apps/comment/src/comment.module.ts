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
      url: "postgresql://postgres:foofie213@127.0.0.1:5432/blog",
    }),
    TypeOrmModule.forFeature([Post, Comment, User]),
  ],
  controllers: [CommentController],
  providers: [CommentService],
})
export class CommentModule {}
