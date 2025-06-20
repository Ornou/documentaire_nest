import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { HealthService } from './health.service';
import { HealthController } from './health.controller';
import { DocumentProcessor } from './document.processor';
import { DocumentModule } from '../document/document.module';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'document',
    }),
    DocumentModule,
  ],
  controllers: [HealthController],
  providers: [HealthService, DocumentProcessor],
})
export class HealthModule {}
