import {
  CommentService,
  CreateCommentDto,
  JwtAuthGuard,
  RequestWithUserId,
  UpdateCommentDto,
} from "@app/shared";
import {
  Body,
  Controller,
  Delete,
  Inject,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { ClientGrpc } from "@nestjs/microservices";
import { GrpcToHttpInterceptor } from "nestjs-grpc-exceptions";

@Controller("comment")
export class CommentController {
  private commentService: CommentService;
  constructor(@Inject("COMMENT_SERVICE") private commentClient: ClientGrpc) {}
  onModuleInit() {
    this.commentService =
      this.commentClient.getService<CommentService>("CommentService");
  }
  // Comment
  @Post()
  @UseInterceptors(GrpcToHttpInterceptor)
  @UseGuards(JwtAuthGuard)
  createComment(@Req() req: RequestWithUserId, @Body() body: CreateCommentDto) {
    return this.commentService.CreateComment({
      author: { id: req.userId },
      ...body,
    });
  }

  @Put("/:id")
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

  @Delete("/:id")
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(GrpcToHttpInterceptor)
  deleteComment(@Req() req: RequestWithUserId, @Param("id") id: string) {
    return this.commentService.DeleteComment({
      author: { id: req.userId },
      commentId: Number(id),
    });
  }
}
