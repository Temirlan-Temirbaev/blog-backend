import {
  JwtAuthGuard,
  RequestWithUserId,
  SearchUsersRequest,
  UpdatePasswordDto,
  UpdateUserDto,
  UserService,
} from "@app/shared";
import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Put,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { ClientGrpc } from "@nestjs/microservices";
import { FileInterceptor } from "@nestjs/platform-express";
import { GrpcToHttpInterceptor } from "nestjs-grpc-exceptions";

@Controller("user")
export class UserController {
  private userService: UserService;
  constructor(@Inject("USER_SERVICE") private userClient: ClientGrpc) {}
  onModuleInit() {
    this.userService = this.userClient.getService<UserService>("UserService");
  }
  @Get()
  @UseInterceptors(GrpcToHttpInterceptor)
  getUsers() {
    return this.userService.GetUsers({});
  }

  @Get("/id/:id")
  @UseInterceptors(GrpcToHttpInterceptor)
  getUserById(@Param("id") id: string) {
    return this.userService.GetUserById({ id: Number(id) });
  }

  @Get("search")
  @UseInterceptors(GrpcToHttpInterceptor)
  searchUsers(@Req() req: { query: SearchUsersRequest }) {
    return this.userService.SearchUsers(req.query);
  }

  @Put("update")
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(GrpcToHttpInterceptor)
  updateUser(@Body() body: UpdateUserDto, @Req() req: RequestWithUserId) {
    return this.userService.UpdateUser({ ...body, id: req.userId });
  }

  @Put("password")
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(GrpcToHttpInterceptor)
  updatePassword(
    @Body() body: UpdatePasswordDto,
    @Req() req: RequestWithUserId
  ) {
    return this.userService.UpdatePassword({ ...body, id: req.userId });
  }

  @Put("avatar")
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(GrpcToHttpInterceptor, FileInterceptor("file"))
  updateAvatar(
    @Req() req: RequestWithUserId,
    @UploadedFile() file: Express.Multer.File
  ) {
    return this.userService.UpdateAvatar({
      id: req.userId,
      image: file.buffer,
    });
  }
}
