import { Controller, Get } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';

import { SeedService } from './seed.service';

@Controller('seed')
export class SeedController {
  constructor(private readonly seedService: SeedService) {}

  @Get()
  @ApiResponse({
    status: 200,
    description: 'Populate database.',
    schema: {
      type: 'string',
      example: 'Seed executed successfully',
    },
  })
  executeSeed() {
    return this.seedService.runSeed();
  }
}
