import { User } from "../entities/user";

export interface UserService {
  GetUserById: (body: GetUserByIdRequest) => Promise<User>;
  GetUsers: (body: {}) => Promise<User[]>;
  UpdateUser: (body: UpdateUserRequest) => Promise<User>;
  UpdatePassword: (body: UpdatePasswordRequest) => Promise<User>;
}

export interface GetUserByIdRequest {
  id: number;
}

export interface UpdateUserRequest {
  id: number;
  nickname: string;
}

export interface UpdatePasswordRequest {
  id: number;
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}
