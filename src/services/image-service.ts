export interface IImageService {
  convertToBase64: (image: File) => Promise<string>;
}

class ImageService implements ImageService {
  async convertToBase64(image: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(image);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  }
}

export default ImageService;
