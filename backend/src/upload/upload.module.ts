import { Module } from '@nestjs/common';
import { UploadScalar } from '../graphql/scalars/upload.scalar';

@Module({
  providers: [UploadScalar],
  exports: [UploadScalar],
})
export class UploadModule {}
