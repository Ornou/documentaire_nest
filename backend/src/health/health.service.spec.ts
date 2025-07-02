import { Test, TestingModule } from '@nestjs/testing';
import { HealthService } from './health.service';
import { getQueueToken } from '@nestjs/bullmq';

const mockQueue = {
  add: jest.fn(),
};

describe('HealthService', () => {
  let service: HealthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HealthService,
        {
          provide: getQueueToken('document'),
          useValue: mockQueue,
        },
      ],
    }).compile();

    service = module.get<HealthService>(HealthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('check', () => {
    it('should return a status of ok', () => {
      expect(service.check()).toEqual({ status: 'ok' });
    });
  });

  describe('addJobToDocumentQueue', () => {
    it('should add a job to the queue and return status ok', async () => {
      const job = { id: '1', name: 'test' };
      mockQueue.add.mockResolvedValue(job);

      const result = await service.addJobToDocumentQueue();
      
      expect(mockQueue.add).toHaveBeenCalledWith('document', { name: 'test' });
      expect(result).toEqual({ status: 'ok', job });
    });
  });
});
