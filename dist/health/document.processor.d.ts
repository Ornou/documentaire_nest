import { WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
export declare class DocumentProcessor extends WorkerHost {
    private readonly logger;
    process(job: Job): Promise<any>;
    private delay;
}
