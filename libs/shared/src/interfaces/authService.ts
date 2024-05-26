import { User } from "../entities/user";

export interface AuthService {
  Register: (body: RegisterRequest) => Promise<RegisterResponse>;
  Login: (body: LoginRequest) => Promise<LoginResponse>;
  CheckLogin: (body: CheckLoginRequest) => Promise<User>;
}

export interface RegisterRequest {
  login: string;
  password: string;
  nickname: string;
  image: Uint8Array;
}

export interface RegisterResponse {
  token: string;
}

export interface LoginRequest {
  login: string;
  password: string;
}

export interface LoginResponse {
  token: string;
}

export interface CheckLoginRequest {
  token: string;
}
