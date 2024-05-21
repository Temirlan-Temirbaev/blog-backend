import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { join } from "path";
import { CommentController } from "./comment.controller";

@Module({
  imports: [
    ClientsModule.register([
      {
        name: "COMMENT_SERVICE",
        transport: Transport.GRPC,
        options: {
          package: "comment",
          protoPath: join(__dirname, "../../../../proto/comment.proto"),
          url: "comment:3001",
        },
      },
    ]),
    JwtModule.register({
      secret: "SECRET_KEY",
      signOptions: {
        expiresIn: "16h",
      },
    }),
  ],
  controllers: [CommentController],
})
export class CommentModule {}
