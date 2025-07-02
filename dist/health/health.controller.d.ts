import { HealthService } from './health.service';
export declare class HealthController {
    private readonly healthService;
    constructor(healthService: HealthService);
    check(): {
        status: string;
    };
    addJob(): Promise<{
        status: string;
        job: import("bullmq").Job<any, any, string>;
    }>;
}
