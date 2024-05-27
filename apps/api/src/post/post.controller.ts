import {
  CreatePostDto,
  GetPostsByContentRequest,
  JwtAuthGuard,
  PostService,
  RequestWithUserId,
  UpdatePostDto,
} from "@app/shared";
import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  Put,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { ClientGrpc } from "@nestjs/microservices";
import { FileInterceptor } from "@nestjs/platform-express";
import { GrpcToHttpInterceptor } from "nestjs-grpc-exceptions";

@Controller("post")
export class PostController {
  private postService: PostService;
  constructor(@Inject("POST_SERVICE") private postClient: ClientGrpc) {}

  onModuleInit() {
    this.postService = this.postClient.getService<PostService>("PostService");
  }

  @Get("page/:page")
  @UseInterceptors(GrpcToHttpInterceptor)
  getPosts(@Param("page") page: number) {
    return this.postService.GetPosts({ page: Number(page) });
  }

  @Get("id/:id")
  @UseInterceptors(GrpcToHttpInterceptor)
  getPostById(@Param("id") id: number) {
    return this.postService.GetPostById({ id: Number(id) });
  }

  @Get("author/:authorId")
  @UseInterceptors(GrpcToHttpInterceptor)
  getPostByAuthor(@Param("authorId") id: number) {
    return this.postService.GetPostsByAuthorId({ id: Number(id) });
  }

  @Get("content")
  @UseInterceptors(GrpcToHttpInterceptor)
  getPostsByContent(@Req() req: { query: GetPostsByContentRequest }) {
    return this.postService.GetPostsByContent(req.query);
  }

  @Post()
  @UseInterceptors(GrpcToHttpInterceptor, FileInterceptor("file"))
  @UseGuards(JwtAuthGuard)
  createPost(
    @Req() req: RequestWithUserId,
    @Body() body: CreatePostDto,
    @UploadedFile() file: Express.Multer.File
  ) {
    if (file) {
      return this.postService.Create({
        ...body,
        author: { id: req.userId },
        file: file.buffer,
      });
    }
    return this.postService.Create({ ...body, author: { id: req.userId } });
  }

  @Put("/:id")
  @UseInterceptors(GrpcToHttpInterceptor)
  @UseGuards(JwtAuthGuard)
  updatePost(
    @Req() req: RequestWithUserId,
    @Body() body: UpdatePostDto,
    @Param("id") id: number,
    @UploadedFile() file: Express.Multer.File
  ) {
    if (file) {
      return this.postService.Update({
        ...body,
        postId: Number(id),
        author: { id: req.userId },
        file: file.buffer,
      });
    }
    return this.postService.Update({
      ...body,
      postId: Number(id),
      author: { id: req.userId },
    });
  }

  @Delete("/:id")
  @UseInterceptors(GrpcToHttpInterceptor)
  @UseGuards(JwtAuthGuard)
  deletePost(@Req() req: RequestWithUserId, @Param("id") id: number) {
    return this.postService.Delete({
      authorId: req.userId,
      postId: Number(id),
    });
  }
}
