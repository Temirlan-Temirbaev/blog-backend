import { ImageService } from "@app/shared";
import {
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  Put,
  Res,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common";
import { ClientGrpc } from "@nestjs/microservices";
import { FileInterceptor } from "@nestjs/platform-express";
import { Response } from "express";
import { Observable, lastValueFrom } from "rxjs";

@Controller("image")
export class ImageController {
  private imageService: ImageService;
  constructor(@Inject("IMAGE_SERVICE") private imageClient: ClientGrpc) {}

  onModuleInit() {
    this.imageService =
      this.imageClient.getService<ImageService>("ImageService");
  }

  @Post()
  @UseInterceptors(FileInterceptor("file"))
  saveImage(@UploadedFile() file: Express.Multer.File) {
    return this.imageService.SaveImage({ image: file.buffer });
  }

  @Get(":id")
  async getImageById(@Param("id") id: string, @Res() res: Response) {
    const imageBufferObservable = this.imageService.GetImage({
      imageId: Number(id),
    });
    const imageBuffer: { image: Uint8Array } = await lastValueFrom(
      //@ts-ignore
      imageBufferObservable
    );
    res.setHeader("Content-Type", "image/jpeg");
    res.send(Buffer.from(imageBuffer.image));
  }

  @Put(":id")
  @UseInterceptors(FileInterceptor("file"))
  async updateImage(
    @Param("id") id: string,
    @UploadedFile() file: Express.Multer.File
  ) {
    return this.imageService.UpdateImage({
      imageId: Number(id),
      image: file.buffer,
    });
  }

  @Delete(":id")
  async delete(@Param("id") id: string) {
    return this.imageService.DeleteImage({
      imageId: Number(id),
    });
  }
}
