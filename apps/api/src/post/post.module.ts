import { Module } from "@nestjs/common";
import { PostController } from "./post.controller";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { join } from "path";
import { JwtModule } from "@nestjs/jwt";

@Module({
  imports: [
    ClientsModule.register([
      {
        name: "POST_SERVICE",
        transport: Transport.GRPC,
        options: {
          package: "post",
          protoPath: join(__dirname, "../../../../proto/post.proto"),
          url: "post:9001",
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
  controllers: [PostController],
})
export class PostModule {}
