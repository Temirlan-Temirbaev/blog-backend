import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { Image, PostgresModule } from "@app/shared";
import { APP_FILTER } from "@nestjs/core";
import { GrpcServerExceptionFilter } from "nestjs-grpc-exceptions";
import { ImageService } from "./image.service";
import { ImageController } from "./image.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ServeStaticModule } from "@nestjs/serve-static";
import { resolve } from "path";
@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: ".env" }),
    PostgresModule,
    TypeOrmModule.forFeature([Image]),
    ServeStaticModule.forRoot({
      rootPath: resolve(__dirname, "../../../../../../", "static"),
    }),
  ],
  controllers: [ImageController],
  providers: [
    ImageService,
    {
      provide: APP_FILTER,
      useClass: GrpcServerExceptionFilter,
    },
  ],
})
export class ImageModule {}
