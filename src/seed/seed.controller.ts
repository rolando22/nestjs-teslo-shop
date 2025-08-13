import { Controller, Get } from '@nestjs/common';

import { SeedService } from './seed.service';
import { Auth } from '@auth/decorators';
import { Role } from '@auth/enums/role.enum';

@Controller('seed')
export class SeedController {
  constructor(private readonly seedService: SeedService) {}

  @Get()
  @Auth(Role.ADMIN)
  executeSeed() {
    return this.seedService.runSeed();
  }
}
