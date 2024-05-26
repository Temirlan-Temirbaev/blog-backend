import { AuthService, JwtAuthGuard, LoginDto, RegisterDto } from "@app/shared";
import {
  Body,
  Controller,
  Get,
  Headers,
  Inject,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { ClientGrpc } from "@nestjs/microservices";
import { FileInterceptor } from "@nestjs/platform-express";
import { GrpcToHttpInterceptor } from "nestjs-grpc-exceptions";

@Controller("auth")
export class AuthController {
  private authService: AuthService;
  constructor(@Inject("AUTH_SERVICE") private client: ClientGrpc) {}
  onModuleInit() {
    this.authService = this.client.getService<AuthService>("AuthService");
  }

  @Post("register")
  @UseInterceptors(GrpcToHttpInterceptor, FileInterceptor("file"))
  register(
    @Body() body: RegisterDto,
    @UploadedFile() file: Express.Multer.File
  ) {
    return this.authService.Register({ ...body, image: file.buffer });
  }

  @Post("login")
  @UseInterceptors(GrpcToHttpInterceptor)
  login(@Body() body: LoginDto) {
    return this.authService.Login(body);
  }

  @Get("check-login")
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(GrpcToHttpInterceptor)
  checkLogin(@Headers("Authorization") authorization: string) {
    return this.authService.CheckLogin({ token: authorization });
  }
}
