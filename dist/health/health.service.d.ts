import { Queue } from 'bullmq';
export declare class HealthService {
    private documentQueue;
    constructor(documentQueue: Queue);
    check(): {
        status: string;
    };
    addJobToDocumentQueue(): Promise<{
        status: string;
        job: import("bullmq").Job<any, any, string>;
    }>;
}
