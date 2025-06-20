import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { DocumentService } from './document.service';
import { DocumentResolver } from './document.resolver';

@Module({
  imports: [ConfigModule, JwtModule.register({ secret: process.env.JWT_SECRET || 'secret', signOptions: { expiresIn: '1d' } })],
  providers: [DocumentResolver, DocumentService],
  exports: [JwtModule]
})
export class DocumentModule {}
