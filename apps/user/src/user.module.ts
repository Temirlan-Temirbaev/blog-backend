import { Module } from "@nestjs/common";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User, PostgresModule } from "@app/shared";
import { APP_FILTER } from "@nestjs/core";
import { GrpcServerExceptionFilter } from "nestjs-grpc-exceptions";

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: ".env" }),
    PostgresModule,
    TypeOrmModule.forFeature([User]),
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
