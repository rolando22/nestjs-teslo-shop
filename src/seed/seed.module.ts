import { Module } from '@nestjs/common';

import { AuthModule } from '@auth/auth.module';
import { ProductsModule } from '@products/products.module';
import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';

@Module({
  imports: [AuthModule, ProductsModule],
  controllers: [SeedController],
  providers: [SeedService],
})
export class SeedModule {}
