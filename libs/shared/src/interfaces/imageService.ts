import { Image } from "../entities/image";
import { SuccessResponse } from "./successResponse";
import { Observable } from "rxjs";

export interface ImageService {
  SaveImage: (body: ImageBytes) => Observable<Image>;
  GetImage: (body: GetImageRequest) => Observable<Uint8Array>;
  UpdateImage: (body: UpdateImageRequest) => Observable<Image>;
  DeleteImage: (body: DeleteImageRequest) => Observable<SuccessResponse>;
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
