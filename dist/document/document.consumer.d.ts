import { WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
export declare class DocumentConsumer extends WorkerHost {
    process(job: Job<any>): Promise<any>;
}
