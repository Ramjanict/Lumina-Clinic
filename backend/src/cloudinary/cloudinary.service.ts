import { BadRequestException, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { v2 as cloudinary } from "cloudinary";

export type UploadedFile = {
  buffer: Buffer;
  mimetype: string;
  originalname: string;
  size: number;
};

@Injectable()
export class CloudinaryService {
  private configured = false;

  constructor(private readonly config: ConfigService) {}

  private setup() {
    if (this.configured) return;
    cloudinary.config({
      cloud_name: this.config.getOrThrow<string>("CLOUDINARY_CLOUD_NAME"),
      api_key: this.config.getOrThrow<string>("CLOUDINARY_API_KEY"),
      api_secret: this.config.getOrThrow<string>("CLOUDINARY_API_SECRET"),
    });
    this.configured = true;
  }

  async upload(file?: UploadedFile) {
    if (!file) {
      throw new BadRequestException("A photo is required");
    }
    const allowed = ["image/jpeg", "image/png", "image/webp"];
    if (!allowed.includes(file.mimetype)) {
      throw new BadRequestException("Upload a JPG, PNG, or WEBP image");
    }
    if (file.size > 2 * 1024 * 1024) {
      throw new BadRequestException("Image must be under 2MB");
    }

    this.setup();

    const url = await new Promise<string>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: "doctors-appointment", resource_type: "image" },
        (error, result) => {
          if (error || !result) {
            reject(error ?? new Error("Image upload failed"));
            return;
          }
          resolve(result.secure_url);
        },
      );
      stream.end(file.buffer);
    });

    return url;
  }
}
