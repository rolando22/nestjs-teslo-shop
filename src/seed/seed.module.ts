import { Module } from '@nestjs/common';

import { ProductsModule } from '@products/products.module';
import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';

@Module({
  imports: [ProductsModule],
  controllers: [SeedController],
  providers: [SeedService],
})
export class SeedModule {}
