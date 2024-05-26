import { Controller } from "@nestjs/common";
import { ImageService } from "./image.service";
import { GrpcMethod } from "@nestjs/microservices";
import {
  DeleteImageRequest,
  GetImageRequest,
  ImageBytes,
  UpdateImageRequest,
} from "@app/shared";

@Controller()
export class ImageController {
  constructor(private readonly imageService: ImageService) {}
  @GrpcMethod("ImageService", "SaveImage")
  async saveImage(data: ImageBytes) {
    return this.imageService.saveImage(data.image);
  }

  @GrpcMethod("ImageService", "GetImage")
  async getImage(data: GetImageRequest) {
    return await this.imageService.getImage(data.fileName);
  }

  @GrpcMethod("ImageService", "UpdateImage")
  async updateImage(data: UpdateImageRequest) {
    console.log(data);
    return await this.imageService.updateImage(data);
  }

  @GrpcMethod("ImageService", "DeleteImage")
  async deleteImage(data: DeleteImageRequest) {
    return await this.imageService.deleteFile(data.fileName);
  }
}
