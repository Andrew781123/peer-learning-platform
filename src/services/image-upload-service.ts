import { IImageService } from "./image-service";

export interface IImageUploadService {
  getImage: (url: string) => Promise<string>;
  uploadImage: (image: File) => Promise<string>;
}

class ImageUploadService implements IImageUploadService {
  constructor(private readonly imageService: IImageService) {}

  async getImage(url: string): Promise<string> {
    return url;
  }

  async uploadImage(image: File): Promise<string> {
    const base64 = await this.imageService.convertToBase64(image);
    return base64;
  }
}

export default ImageUploadService;
