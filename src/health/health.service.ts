import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';
import { InjectQueue } from '@nestjs/bullmq';

@Injectable()
export class HealthService {
  constructor(@InjectQueue('document') private documentQueue: Queue) {}
  check() {
    return {
      status: 'ok',
    };
  }

  async addJobToDocumentQueue() {
    const job = await this.documentQueue.add('document', {
      name: 'test',
    });
    return {
      status: 'ok',
      job: job,
    };
  }
}
