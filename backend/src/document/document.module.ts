import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BullModule } from '@nestjs/bullmq';
import { JwtModule } from '@nestjs/jwt';
import { DocumentService } from './document.service';
import { DocumentResolver } from './document.resolver';
import { DocumentConsumer } from './document.consumer';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'document',
    }),
    ConfigModule, 
    JwtModule.register({ 
      secret: process.env.JWT_SECRET || 'secret', 
      signOptions: { expiresIn: '1d' } 
    })
  ],
  providers: [DocumentResolver, DocumentService, DocumentConsumer], 
  exports: [JwtModule]
})
export class DocumentModule {}
