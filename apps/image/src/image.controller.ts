import { Controller } from "@nestjs/common";
import { ImageService } from "./image.service";
import { GrpcMethod } from "@nestjs/microservices";
import { ImageBytes, ProtoInt, UpdateImageRequest } from "@app/shared";

@Controller()
export class ImageController {
  constructor(private readonly imageService: ImageService) {}
  @GrpcMethod("ImageService", "SaveImage")
  async saveImage(data: ImageBytes) {
    return this.imageService.saveImage(data.image);
  }

  @GrpcMethod("ImageService", "GetImage")
  async getImage(data: { imageId: ProtoInt }) {
    return await this.imageService.getImage(data.imageId.low);
  }

  @GrpcMethod("ImageService", "UpdateImage")
  async updateImage(data: UpdateImageRequest & { imageId: ProtoInt }) {
    return await this.imageService.updateImage({
      ...data,
      imageId: data.imageId.low,
    });
  }

  @GrpcMethod("ImageService", "DeleteImage")
  async deleteImage(data: { imageId: ProtoInt }) {
    return await this.imageService.deleteFile(data.imageId.low);
  }
}
