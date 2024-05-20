import { Module } from "@nestjs/common";
import { CommentController } from "./comment.controller";
import { CommentService } from "./comment.service";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User, Post, Comment, PostgresModule } from "@app/shared";

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: ".env" }),
    PostgresModule,
    TypeOrmModule.forFeature([Post, Comment, User]),
  ],
  controllers: [CommentController],
  providers: [CommentService],
})
export class CommentModule {}
