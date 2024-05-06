import { Controller } from "@nestjs/common";
import { UserService } from "./user.service";
import { GrpcMethod } from "@nestjs/microservices";
import { User } from "@app/shared";
import {
  UpdatePasswordRequest,
  UpdateUserRequest,
} from "@app/shared/interfaces/userService";
import { ProtoInt } from "@app/shared/interfaces/protoInt";

@Controller()
export class UserController {
  constructor(private readonly appService: UserService) {}

  @GrpcMethod("UserService", "GetUsers")
  async getUsers() {
    const users = await this.appService.getUsers();
    return { users };
  }

  @GrpcMethod("UserService", "GetUserById")
  async getUserById(body: { id: ProtoInt }): Promise<User> {
    return this.appService.getUserById(body.id.low);
  }

  @GrpcMethod("UserService", "UpdateUser")
  async updateUser(data: UpdateUserRequest & { id: ProtoInt }): Promise<User> {
    return this.appService.updateUser({
      nickname: data.nickname,
      id: data.id.low,
    });
  }

  @GrpcMethod("UserService", "UpdatePassword")
  async updatePassword(
    data: UpdatePasswordRequest & { id: ProtoInt }
  ): Promise<User> {
    return this.appService.updatePassword({ ...data, id: data.id.low });
  }
}
