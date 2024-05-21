import { AuthService, JwtAuthGuard, LoginDto, RegisterDto } from "@app/shared";
import {
  Body,
  Controller,
  Get,
  Headers,
  Inject,
  Post,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { ClientGrpc } from "@nestjs/microservices";
import { GrpcToHttpInterceptor } from "nestjs-grpc-exceptions";

@Controller("auth")
export class AuthController {
  private authService: AuthService;
  constructor(@Inject("AUTH_SERVICE") private client: ClientGrpc) {}
  onModuleInit() {
    this.authService = this.client.getService<AuthService>("AuthService");
  }

  @Post("register")
  @UseInterceptors(GrpcToHttpInterceptor)
  register(@Body() body: RegisterDto) {
    return this.authService.Register(body);
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
