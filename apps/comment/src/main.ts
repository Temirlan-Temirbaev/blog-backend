import { NestFactory } from "@nestjs/core";
import { MicroserviceOptions, Transport } from "@nestjs/microservices";
import { join } from "path";
import { CommentModule } from "./comment.module";

async function bootstrap() {
  const app = await NestFactory.create(CommentModule);
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      package: "comment",
      protoPath: join(__dirname, "../../../proto/comment.proto"),
      url: "comment:3001",
    },
  });
  await app.startAllMicroservices();
  await app.listen(3000);
}
bootstrap();
