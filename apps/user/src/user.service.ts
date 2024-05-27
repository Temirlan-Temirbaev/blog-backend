import {
  SearchUsersRequest,
  UpdatePasswordRequest,
  UpdateUserRequest,
  User,
  ImageService,
  UpdateAvatarRequest,
  Image,
} from "@app/shared";
import { Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import {
  GrpcAbortedException,
  GrpcNotFoundException,
} from "nestjs-grpc-exceptions";
import { Like, Repository } from "typeorm";
import * as bcrypt from "bcryptjs";
import { ClientGrpc } from "@nestjs/microservices";
import { lastValueFrom } from "rxjs";

@Injectable()
export class UserService {
  private imageService: ImageService;

  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @Inject("IMAGE_SERVICE") private imageClient: ClientGrpc
  ) {}

  onModuleInit() {
    this.imageService =
      this.imageClient.getService<ImageService>("ImageService");
  }

  async getUsers(): Promise<User[]> {
    const users = await this.userRepository.query(
      "SELECT id, nickname, avatar FROM public.user"
    );
    if (!users) {
      throw new GrpcNotFoundException("Users not found");
    }
    return users;
  }

  async getUserById(id: number): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ["posts"],
    });
    if (!user) {
      throw new GrpcNotFoundException("User not found");
    }
    return user;
  }

  async updateUser(body: UpdateUserRequest): Promise<User> {
    const user = await this.getUserById(body.id);
    if (!user) return;
    user.nickname = body.nickname;
    await this.userRepository.save(user);
    return user;
  }

  async updatePassword(body: UpdatePasswordRequest): Promise<User> {
    const user = await this.getUserById(body.id);
    if (!user) return;
    const isValidPassword = await bcrypt.compare(
      body.oldPassword,
      user.password
    );
    if (!isValidPassword) {
      throw new GrpcAbortedException("Uncorrect password");
    }
    if (body.newPassword != body.confirmPassword) {
      throw new GrpcAbortedException("Passwords didnt match");
    }
    const hashedPassword = await bcrypt.hash(body.newPassword, 5);
    user.password = hashedPassword;
    await this.userRepository.save(user);
    return user;
  }

  async searchUser({ nickname }: SearchUsersRequest) {
    const users = await this.userRepository.find({
      where: { nickname: Like(`%${nickname}%`) },
    });
    return { users };
  }

  async updateAvatar(body: UpdateAvatarRequest) {
    const user = await this.getUserById(body.id);
    if (!user) return;
    const imageObservable = this.imageService.UpdateImage({
      fileName: user.avatar,
      image: body.image,
    });

    // @ts-ignore
    const image: Image = await lastValueFrom(imageObservable);
    console.log(image);

    user.avatar = image.fileName;
    await this.userRepository.save(user);
    return { success: true };
  }
}
