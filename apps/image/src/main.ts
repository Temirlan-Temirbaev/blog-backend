import { NestFactory } from "@nestjs/core";
import { MicroserviceOptions, Transport } from "@nestjs/microservices";
import { join } from "path";
import { ImageModule } from "./image.module";

async function bootstrap() {
  const app = await NestFactory.create(ImageModule);
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      package: "image",
      protoPath: join(__dirname, "../../../proto/image.proto"),
      url: "image:9001",
    },
  });
  await app.startAllMicroservices();
  await app.listen(9002);
}
bootstrap();
