import { Resolver, Query } from '@nestjs/graphql';
import { HealthService } from './health.service';

@Resolver()
export class HealthResolver {

  constructor(private readonly healthService: HealthService) {}

  @Query(() => String)
  check() {
    return this.healthService.check();
  }
}
