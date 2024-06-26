import { Controller } from "@nestjs/common";
import { UserService } from "./user.service";
import { GrpcMethod } from "@nestjs/microservices";
import {
  User,
  ProtoInt,
  UpdatePasswordRequest,
  UpdateUserRequest,
  SearchUsersRequest,
  UpdateAvatarRequest,
} from "@app/shared";

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

  @GrpcMethod("UserService", "SearchUsers")
  async searchUsers(data: SearchUsersRequest) {
    return this.appService.searchUser(data);
  }

  @GrpcMethod("UserService", "UpdateAvatar")
  async updateUsers(data: UpdateAvatarRequest & { id: ProtoInt }) {
    return await this.appService.updateAvatar({ ...data, id: data.id.low });
  }
}
