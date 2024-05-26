import { Module } from "@nestjs/common";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User, PostgresModule } from "@app/shared";
import { APP_FILTER } from "@nestjs/core";
import { GrpcServerExceptionFilter } from "nestjs-grpc-exceptions";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { join } from "path";

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: ".env" }),
    PostgresModule,
    TypeOrmModule.forFeature([User]),
    ClientsModule.register([
      {
        name: "IMAGE_SERVICE",
        transport: Transport.GRPC,
        options: {
          package: "image",
          protoPath: join(__dirname, "../../../proto/image.proto"),
          url: "image:9001",
        },
      },
    ]),
  ],
  controllers: [UserController],
  providers: [
    UserService,
    {
      provide: APP_FILTER,
      useClass: GrpcServerExceptionFilter,
    },
  ],
})
export class UserModule {}
