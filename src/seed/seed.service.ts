import { Injectable } from '@nestjs/common';

import { ProductsService } from '@products/products.service';
import { initialData } from './data/seed-data';

@Injectable()
export class SeedService {
  constructor(private productsService: ProductsService) {}

  async runSeed() {
    await this.productsService.deleteAll();

    const { products } = initialData;

    const insertProducts = products.map((product) =>
      this.productsService.create(product),
    );

    await Promise.all(insertProducts);

    return 'Seed executed successfully';
  }
}
