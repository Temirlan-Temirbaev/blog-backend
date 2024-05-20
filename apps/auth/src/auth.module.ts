import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User, PostgresModule } from "@app/shared";
import { APP_FILTER } from "@nestjs/core";
import { GrpcServerExceptionFilter } from "nestjs-grpc-exceptions";
import { JwtModule } from "@nestjs/jwt";
@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: ".env" }),
    PostgresModule,
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
      secret: "SECRET_KEY",
      signOptions: {
        expiresIn: "16h",
      },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    {
      provide: APP_FILTER,
      useClass: GrpcServerExceptionFilter,
    },
  ],
})
export class AuthModule {}
