import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UploadedImage } from '../types/uploaded-image.type';

const ALLOWED_IMAGE_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);

@Injectable()
export class VerificationImagePipe implements PipeTransform<UploadedImage> {
  constructor(private readonly configService: ConfigService) {}

  transform(file?: UploadedImage) {
    if (!file) {
      throw new BadRequestException('An image file is required');
    }

    if (!ALLOWED_IMAGE_TYPES.has(file.mimetype)) {
      throw new BadRequestException('Only JPEG, PNG, and WebP images are allowed');
    }

    const maxSize = Number(
      this.configService.get<string>('DRIVER_VERIFICATION_MAX_FILE_SIZE', '5242880'),
    );
    if (!Number.isFinite(maxSize) || maxSize <= 0) {
      throw new BadRequestException('Invalid verification upload size configuration');
    }
    if (file.size > maxSize) {
      throw new BadRequestException(`Image size must not exceed ${maxSize} bytes`);
    }

    return file;
  }
}
