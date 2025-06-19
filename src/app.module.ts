import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { DocumentModule } from './document/document.module';
import { HealthController } from './health/health.controller';
import { HealthService } from './health/health.service';
import { HealthModule } from './health/health.module';

@Module({
  imports: [UserModule, DocumentModule, HealthModule],
  controllers: [AppController, HealthController],
  providers: [AppService, HealthService],
})
export class AppModule {}
