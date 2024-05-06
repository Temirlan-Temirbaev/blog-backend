import { Controller } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { GrpcMethod } from "@nestjs/microservices";
import {
  User,
  CheckLoginRequest,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
} from "@app/shared";

@Controller()
export class AuthController {
  constructor(private readonly appService: AuthService) {}

  @GrpcMethod("AuthService", "Register")
  async register(body: RegisterRequest): Promise<RegisterResponse> {
    return await this.appService.register(body);
  }

  @GrpcMethod("AuthService", "Login")
  async login(body: LoginRequest): Promise<LoginResponse> {
    return await this.appService.login(body);
  }
  @GrpcMethod("AuthService", "CheckLogin")
  async checkLogin(body: CheckLoginRequest): Promise<User> {
    return await this.appService.checkLogin(body.token);
  }
}
