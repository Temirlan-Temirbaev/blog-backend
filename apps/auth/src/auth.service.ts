import {
  User,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
} from "@app/shared";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import * as bcrypt from "bcryptjs";
import { JwtService } from "@nestjs/jwt";
import {
  GrpcAlreadyExistsException,
  GrpcInternalException,
  GrpcInvalidArgumentException,
  GrpcNotFoundException,
  GrpcUnauthenticatedException,
} from "nestjs-grpc-exceptions";

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private jwtService: JwtService
  ) {}
  async register(body: RegisterRequest): Promise<RegisterResponse> {
    const candidate = await this.userRepository.findOneBy({
      login: body.login,
    });
    if (candidate)
      throw new GrpcAlreadyExistsException(
        "User already with same login exists"
      );
    const hashedPassword = await bcrypt.hash(body.password, 5);
    const user = this.userRepository.create({
      ...body,
      password: hashedPassword,
    });
    await this.userRepository.save(user);
    return { token: this.jwtService.sign({ id: user.id }) };
  }

  async login(body: LoginRequest): Promise<LoginResponse> {
    const user = await this.userRepository.findOneBy({ login: body.login });
    if (!user) throw new GrpcNotFoundException("User is not found");

    const isValidPassword = await bcrypt.compare(body.password, user.password);
    if (!isValidPassword)
      throw new GrpcInvalidArgumentException("Uncorrect password");
    return { token: this.jwtService.sign({ id: user.id }) };
  }

  async checkLogin(token: string): Promise<User> {
    const { id }: User = await this.jwtService.verify(token.split(" ")[1]);

    if (!id || !token.includes("Bearer")) {
      throw new GrpcUnauthenticatedException("Invalid token");
    }

    const dbUser = await this.userRepository.findOneBy({ id });

    if (!dbUser) {
      throw new GrpcInternalException("User not found");
    }
    return dbUser;
  }
}
