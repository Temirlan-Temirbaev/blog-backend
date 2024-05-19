import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { join } from "path";
import { JwtModule } from "@nestjs/jwt";
@Module({
  imports: [
    ClientsModule.register([
      {
        name: "AUTH_SERVICE",
        transport: Transport.GRPC,
        options: {
          package: "auth",
          protoPath: join(__dirname, "../../../proto/auth.proto"),
          url: "auth:1002",
        },
      },
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
        name: "POST_SERVICE",
        transport: Transport.GRPC,
        options: {
          package: "post",
          protoPath: join(__dirname, "../../../proto/post.proto"),
          url: "post:9001",
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
    ]),
    JwtModule.register({
      secret: "SECRET_KEY",
      signOptions: {
        expiresIn: "16h",
      },
    }),
  ],
  controllers: [AppController],
})
export class AppModule {}
