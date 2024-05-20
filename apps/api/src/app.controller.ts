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
  Delete,
} from "@nestjs/common";
import { ClientGrpc } from "@nestjs/microservices";
import { GrpcToHttpInterceptor } from "nestjs-grpc-exceptions";
import {
  AuthService,
  LoginDto,
  RegisterDto,
  JwtAuthGuard,
  RequestWithUserId,
  UpdateUserRequest,
  UserService,
  UpdatePasswordDto,
  PostService,
  CreatePostDto,
  UpdatePostDto,
  CommentService,
  CreateCommentDto,
  UpdateCommentDto,
} from "@app/shared";

@Controller()
export class AppController {
  private authService: AuthService;
  private userService: UserService;
  private postService: PostService;
  private commentService: CommentService;
  constructor(
    @Inject("AUTH_SERVICE") private client: ClientGrpc,
    @Inject("USER_SERVICE") private userClient: ClientGrpc,
    @Inject("POST_SERVICE") private postClient: ClientGrpc,
    @Inject("COMMENT_SERVICE") private commentClient: ClientGrpc
  ) {}

  onModuleInit() {
    this.authService = this.client.getService<AuthService>("AuthService");
    this.userService = this.userClient.getService<UserService>("UserService");
    this.postService = this.postClient.getService<PostService>("PostService");
    this.commentService =
      this.commentClient.getService<CommentService>("CommentService");
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
  @UseInterceptors(GrpcToHttpInterceptor)
  getPosts(@Param("page") page: number) {
    return this.postService.GetPosts({ page: Number(page) });
  }

  @Get("post/id/:id")
  @UseInterceptors(GrpcToHttpInterceptor)
  getPostById(@Param("id") id: number) {
    return this.postService.GetPostById({ id: Number(id) });
  }

  @Get("post/author/:authorId")
  @UseInterceptors(GrpcToHttpInterceptor)
  getPostByAuthor(@Param("authorId") id: number) {
    return this.postService.GetPostsByAuthorId({ id: Number(id) });
  }

  @Post("post")
  @UseInterceptors(GrpcToHttpInterceptor)
  @UseGuards(JwtAuthGuard)
  createPost(@Req() req: RequestWithUserId, @Body() body: CreatePostDto) {
    return this.postService.Create({ ...body, author: { id: req.userId } });
  }

  @Put("post/:id")
  @UseInterceptors(GrpcToHttpInterceptor)
  @UseGuards(JwtAuthGuard)
  updatePost(
    @Req() req: RequestWithUserId,
    @Body() body: UpdatePostDto,
    @Param("id") id: number
  ) {
    return this.postService.Update({
      ...body,
      postId: Number(id),
      author: { id: req.userId },
    });
  }

  @Delete("post/:id")
  @UseInterceptors(GrpcToHttpInterceptor)
  @UseGuards(JwtAuthGuard)
  deletePost(@Req() req: RequestWithUserId, @Param("id") id: number) {
    return this.postService.Delete({
      authorId: req.userId,
      postId: Number(id),
    });
  }

  // Comment
  @Post("comment")
  @UseInterceptors(GrpcToHttpInterceptor)
  @UseGuards(JwtAuthGuard)
  createComment(@Req() req: RequestWithUserId, @Body() body: CreateCommentDto) {
    return this.commentService.CreateComment({
      author: { id: req.userId },
      ...body,
    });
  }

  @Put("comment/:id")
  @UseInterceptors(GrpcToHttpInterceptor)
  @UseGuards(JwtAuthGuard)
  updateComment(
    @Req() req: RequestWithUserId,
    @Body() body: UpdateCommentDto,
    @Param("id") id: string
  ) {
    return this.commentService.UpdateComment({
      author: { id: req.userId },
      ...body,
      commentId: Number(id),
    });
  }

  @Delete("comment/:id")
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(GrpcToHttpInterceptor)
  deleteComment(@Req() req: RequestWithUserId, @Param("id") id: string) {
    return this.commentService.DeleteComment({
      author: { id: req.userId },
      commentId: Number(id),
    });
  }
}
