import { Module } from '@nestjs/common';
import { VerificationController } from './verification.controller';
import { VerificationImagePipe } from './pipes/verification-image.pipe';
import { VerificationService } from './verification.service';

@Module({
  controllers: [VerificationController],
  providers: [VerificationService, VerificationImagePipe],
  exports: [VerificationService],
})
export class VerificationModule {}
