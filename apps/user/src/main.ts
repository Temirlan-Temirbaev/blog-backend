import { NestFactory } from "@nestjs/core";
import { UserModule } from "./user.module";
import { MicroserviceOptions, Transport } from "@nestjs/microservices";
import { join } from "path";

async function bootstrap() {
  const app = await NestFactory.create(UserModule);
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      package: "user",
      protoPath: join(__dirname, "../../../proto/user.proto"),
      url: "localhost:6001",
    },
  });
  await app.startAllMicroservices();
  await app.listen(4000);
}
bootstrap();
