import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { JwtModule } from "@nestjs/jwt";
import { join } from "path";

@Module({
  imports: [
    ClientsModule.register([
      {
        name: "AUTH_SERVICE",
        transport: Transport.GRPC,
        options: {
          package: "auth",
          protoPath: join(__dirname, "../../../../proto/auth.proto"),
          url: "auth:1002",
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
  controllers: [AuthController],
})
export class AuthModule {}
