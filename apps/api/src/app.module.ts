import { Module } from "@nestjs/common";
import { UserModule } from "./user/user.module";
import { PostModule } from "./post/post.module";
import { CommentModule } from "./comment/comment.module";
import { AuthModule } from "./auth/auth.module";
import { ImageModule } from "./image/image.module";
@Module({
  imports: [UserModule, PostModule, CommentModule, AuthModule, ImageModule],
})
export class AppModule {}
