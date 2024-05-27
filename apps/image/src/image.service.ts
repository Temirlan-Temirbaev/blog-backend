import { Image, UpdateImageRequest } from "@app/shared";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import {
  existsSync,
  mkdirSync,
  readFileSync,
  unlinkSync,
  writeFileSync,
} from "fs";
import { GrpcNotFoundException } from "nestjs-grpc-exceptions";
import { join, resolve } from "path";
import { Repository } from "typeorm";
import * as uuid from "uuid";
@Injectable()
export class ImageService {
  constructor(
    @InjectRepository(Image) private imageRepository: Repository<Image>
  ) {}

  async saveImage(image: Uint8Array) {
    const fileName = uuid.v4() + ".jpg";
    const filePath = resolve(__dirname, "static");
    if (!existsSync(filePath)) {
      mkdirSync(filePath);
    }
    writeFileSync(join(filePath, fileName), image);
    const imageEntity = this.imageRepository.create({
      fileName,
      filePath,
    });
    return await this.imageRepository.save(imageEntity);
  }

  async getImage(fileName: string) {
    const imageEntity = await this.imageRepository.findOneBy({ fileName });
    if (!imageEntity) {
      throw new GrpcNotFoundException("Image not found");
    }
    const fullPath = join(imageEntity.filePath, imageEntity.fileName);
    return { image: readFileSync(fullPath) };
  }

  async updateImage(data: UpdateImageRequest) {
    const imageEntity = await this.imageRepository.findOneBy({
      fileName: data.fileName,
    });
    if (!imageEntity) {
      throw new GrpcNotFoundException("Image not found");
    }
    const filePath = resolve(__dirname, "static");
    if (!existsSync(join(filePath, imageEntity.fileName))) {
      throw new GrpcNotFoundException("Image not found");
    }
    try {
      unlinkSync(join(filePath, imageEntity.fileName));
    } catch (e) {
      console.log("Image is not exist");
    }
    const newFileName = uuid.v4() + ".jpg";
    writeFileSync(join(filePath, newFileName), data.image);
    imageEntity.fileName = newFileName;
    return await this.imageRepository.save(imageEntity);
  }

  async deleteFile(fileName: string) {
    const { filePath } = await this.imageRepository.findOneBy({
      fileName,
    });
    if (!filePath || !fileName) {
      throw new GrpcNotFoundException("File not found");
    }
    if (!existsSync(join(filePath, fileName))) {
      throw new GrpcNotFoundException("File not found");
    }
    unlinkSync(join(filePath, fileName));
    return { success: true };
  }
}
