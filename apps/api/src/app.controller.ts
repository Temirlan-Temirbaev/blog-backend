import {
  Controller,
  Post,
  Inject,
  Body,
  UseInterceptors,
  Get,
  Headers,
  UseGuards,
  Param,
  Put,
  Req,
} from "@nestjs/common";
import { ClientGrpc } from "@nestjs/microservices";
import { GrpcToHttpInterceptor } from "nestjs-grpc-exceptions";
import {
  AuthService,
  LoginDto,
  RegisterDto,
  JwtAuthGuard,
  RequestWithUserId,
} from "@app/shared";
import {
  UpdateUserRequest,
  UserService,
} from "@app/shared/interfaces/userService";
import { UpdatePasswordDto } from "@app/shared/dto/user/updatePassword.dto";
import { PostService } from "@app/shared/interfaces/postService";

@Controller()
export class AppController {
  private authService: AuthService;
  private userService: UserService;
  private postService: PostService;
  constructor(
    @Inject("AUTH_SERVICE") private client: ClientGrpc,
    @Inject("USER_SERVICE") private userClient: ClientGrpc,
    @Inject("POST_SERVICE") private postClient: ClientGrpc
  ) {}

  onModuleInit() {
    this.authService = this.client.getService<AuthService>("AuthService");
    this.userService = this.userClient.getService<UserService>("UserService");
    this.postService = this.postClient.getService<PostService>("PostService");
  }

  //Auth
  @Post("auth/register")
  @UseInterceptors(GrpcToHttpInterceptor)
  register(@Body() body: RegisterDto) {
    return this.authService.Register(body);
  }

  @Post("auth/login")
  @UseInterceptors(GrpcToHttpInterceptor)
  login(@Body() body: LoginDto) {
    return this.authService.Login(body);
  }

  @Get("auth/check-login")
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(GrpcToHttpInterceptor)
  checkLogin(@Headers("Authorization") authorization: string) {
    return this.authService.CheckLogin({ token: authorization });
  }

  // User
  @Get("user")
  @UseInterceptors(GrpcToHttpInterceptor)
  getUsers() {
    return this.userService.GetUsers({});
  }

  @Get("user/:id")
  @UseInterceptors(GrpcToHttpInterceptor)
  getUserById(@Param("id") id: string) {
    return this.userService.GetUserById({ id: Number(id) });
  }

  @Put("user/update")
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(GrpcToHttpInterceptor)
  updateUser(@Body() body: UpdateUserRequest, @Req() req: RequestWithUserId) {
    return this.userService.UpdateUser({ ...body, id: req.userId });
  }

  @Put("user/password")
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(GrpcToHttpInterceptor)
  updatePassword(
    @Body() body: UpdatePasswordDto,
    @Req() req: RequestWithUserId
  ) {
    return this.userService.UpdatePassword({ ...body, id: req.userId });
  }

  // Post

  @Get("post/page/:page")
  getPosts(@Param("page") page: number) {
    return this.postService.GetPosts({ page: Number(page) });
  }

  @Get("post/id/:id")
  getPostById(@Param("id") id: number) {
    return this.postService.GetPostById({ id: Number(id) });
  }
}
