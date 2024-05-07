import { User } from "@app/shared";
import {
  UpdatePasswordRequest,
  UpdateUserRequest,
} from "@app/shared/interfaces/userService";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import {
  GrpcAbortedException,
  GrpcNotFoundException,
} from "nestjs-grpc-exceptions";
import { Repository } from "typeorm";
import * as bcrypt from "bcryptjs";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>
  ) {}

  async getUsers(): Promise<User[]> {
    const users = await this.userRepository.find();
    if (!users) {
      throw new GrpcNotFoundException("Users not found");
    }
    users.forEach((user) => {
      delete user.login;
      delete user.password;
    });
    return users;
  }

  async getUserById(id: number): Promise<User> {
    const user = await this.userRepository.findOneBy({ id });
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
}