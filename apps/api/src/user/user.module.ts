import { Module } from "@nestjs/common";
import { UserController } from "./user.controller";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { join } from "path";
import { JwtModule } from "@nestjs/jwt";

@Module({
  imports: [
    ClientsModule.register([
      {
        name: "USER_SERVICE",
        transport: Transport.GRPC,
        options: {
          package: "user",
          protoPath: join(__dirname, "../../../../proto/user.proto"),
          url: "user:2001",
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
  controllers: [UserController],
})
export class UserModule {}
