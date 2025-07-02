import { Controller, Get, Post } from '@nestjs/common';
import { HealthService } from './health.service';

@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get()
  check() {
    return this.healthService.check();
  }

  @Post('add-job')
  async addJob() {
    return await this.healthService.addJobToDocumentQueue();
  }
}
