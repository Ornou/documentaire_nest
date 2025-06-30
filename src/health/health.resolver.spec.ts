import { Test, TestingModule } from '@nestjs/testing';
import { HealthResolver } from './health.resolver';
import { HealthService } from './health.service';

const mockHealthService = {
  check: jest.fn(),
};

describe('HealthResolver', () => {
  let resolver: HealthResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HealthResolver,
        {
          provide: HealthService,
          useValue: mockHealthService,
        },
      ],
    }).compile();

    resolver = module.get<HealthResolver>(HealthResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('check', () => {
    it('should call the health service check method', () => {
      const expected = { status: 'ok' };
      mockHealthService.check.mockReturnValue(expected);
      const result = resolver.check();
      expect(result).toBe(expected);
      expect(mockHealthService.check).toHaveBeenCalled();
    });
  });
}); 