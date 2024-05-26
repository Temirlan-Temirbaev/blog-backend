import {
  User,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  ImageService,
  Image,
} from "@app/shared";
import { Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import * as bcrypt from "bcryptjs";
import { JwtService } from "@nestjs/jwt";
import {
  GrpcAbortedException,
  GrpcAlreadyExistsException,
  GrpcInternalException,
  GrpcInvalidArgumentException,
  GrpcNotFoundException,
  GrpcUnauthenticatedException,
} from "nestjs-grpc-exceptions";
import { ClientGrpc } from "@nestjs/microservices";
import { lastValueFrom } from "rxjs";

@Injectable()
export class AuthService {
  private imageService: ImageService;
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private jwtService: JwtService,
    @Inject("IMAGE_SERVICE") private imageClient: ClientGrpc
  ) {}

  onModuleInit() {
    this.imageService =
      this.imageClient.getService<ImageService>("ImageService");
  }

  async register(body: RegisterRequest): Promise<RegisterResponse> {
    const candidate = await this.userRepository.findOneBy({
      login: body.login,
    });
    if (candidate)
      throw new GrpcAlreadyExistsException(
        "User already with same login exists"
      );
    const hashedPassword = await bcrypt.hash(body.password, 5);
    const imageObservable = this.imageService.SaveImage({ image: body.image });
    // @ts-ignore
    const image: Image = await lastValueFrom(imageObservable);
    if (!image) {
      throw new GrpcAbortedException("Could'nt upload your avatar");
    }
    const user = this.userRepository.create({
      ...body,
      password: hashedPassword,
      avatar: image.fileName,
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
