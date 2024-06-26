import { NestFactory } from "@nestjs/core";
import { AuthModule } from "./auth.module";
import { MicroserviceOptions, Transport } from "@nestjs/microservices";
import { join } from "path";

async function bootstrap() {
  const app = await NestFactory.create(AuthModule);
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      package: "auth",
      protoPath: join(__dirname, "../../../proto/auth.proto"),
      url: "auth:1002",
    },
  });
  await app.startAllMicroservices();
  await app.listen(1001);
}
bootstrap();
