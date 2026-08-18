import {
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Res,
  StreamableFile,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { createReadStream } from 'fs';
import { CurrentUser } from 'src/modules/auth-module/decorators/current-user.decorator';
import { Roles } from 'src/modules/auth-module/decorators/roles.decorator';
import { UserRole } from 'src/modules/auth-module/enums/user-role.enum';
import { UploadVerificationDto } from './dto/upload-verification.dto';
import { VerificationImagePipe } from './pipes/verification-image.pipe';
import { UploadedImage } from './types/uploaded-image.type';
import { VerificationService } from './verification.service';

@Controller('driver/verification')
@Roles(UserRole.driver)
export class VerificationController {
  constructor(private readonly verificationService: VerificationService) {}

  @Post(':documentType')
  @UseInterceptors(FileInterceptor('file'))
  upload(
    @CurrentUser('id') userId: string,
    @Param() params: UploadVerificationDto,
    @UploadedFile(VerificationImagePipe) file: UploadedImage,
  ) {
    return this.verificationService.upload(userId, params.documentType, file);
  }

  @Get()
  list(@CurrentUser('id') userId: string) {
    return this.verificationService.listForDriver(userId);
  }

  @Get(':documentType')
  async image(
    @CurrentUser('id') userId: string,
    @Param() params: UploadVerificationDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const verification = await this.verificationService.getForDriver(userId, params.documentType);
    response.type(verification.filePath.endsWith('.png') ? 'image/png' : verification.filePath.endsWith('.webp') ? 'image/webp' : 'image/jpeg');
    return new StreamableFile(createReadStream(this.verificationService.getAbsoluteFilePath(verification.filePath)));
  }

  @Patch(':documentType')
  @UseInterceptors(FileInterceptor('file'))
  update(
    @CurrentUser('id') userId: string,
    @Param() params: UploadVerificationDto,
    @UploadedFile(VerificationImagePipe) file: UploadedImage,
  ) {
    return this.verificationService.upload(userId, params.documentType, file);
  }
}
