import { Image } from "../entities/image";
import { SuccessResponse } from "./successResponse";

export interface ImageService {
  SaveImage: (body: ImageBytes) => Promise<Image>;
  GetImage: (body: GetImageRequest) => Promise<Uint8Array>;
  UpdateImage: (body: UpdateImageRequest) => Promise<Image>;
  DeleteImage: (body: DeleteImageRequest) => Promise<SuccessResponse>;
}

export interface ImageBytes {
  image: Uint8Array;
}

export interface GetImageRequest {
  fileName: string;
}

export interface UpdateImageRequest {
  fileName: string;
  image: Uint8Array;
}

export interface DeleteImageRequest {
  fileName: string;
}
