import { Resolver} from '@nestjs/graphql';
import { HealthService } from './health.service';
@Resolver(()=> String)
export class HealthResolver {

  constructor(private readonly healthService: HealthService) {}
    @Resolver(() => String)
    check() {
      return this.healthService.check();
    }
}
