import { Module } from "@nestjs/common";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { join } from "path";
import { JwtModule } from "@nestjs/jwt";
import { ImageController } from "./image.controller";

@Module({
  imports: [
    ClientsModule.register([
      {
        name: "IMAGE_SERVICE",
        transport: Transport.GRPC,
        options: {
          package: "image",
          protoPath: join(__dirname, "../../../../proto/image.proto"),
          url: "image:9001",
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
  controllers: [ImageController],
})
export class ImageModule {}
