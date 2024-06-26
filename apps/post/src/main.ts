import { NestFactory } from "@nestjs/core";
import { PostModule } from "./post.module";
import { MicroserviceOptions, Transport } from "@nestjs/microservices";
import { join } from "path";

async function bootstrap() {
  const app = await NestFactory.create(PostModule);
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      package: "post",
      protoPath: join(__dirname, "../../../proto/post.proto"),
      url: "post:9001",
    },
  });
  await app.startAllMicroservices();
  await app.listen(9000);
}

bootstrap();
