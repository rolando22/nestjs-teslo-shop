import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { ProductImage, Product } from './entities';

@Module({
  imports: [TypeOrmModule.forFeature([ProductImage, Product])],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}
