import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "../entities/user";
import { Post } from "../entities/post";
import { Comment } from "../entities/comment";
import { ConfigModule } from "@nestjs/config";

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: ".env" }),
    TypeOrmModule.forRoot({
      entities: [User, Post, Comment],
      type: "postgres",
      url: process.env.POSTGRES_URL,
      synchronize: true,
    }),
  ],
})
export class PostgresModule {}
