import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ProductsService } from '@products/products.service';
import { BcryptAdapter } from '@auth/adapters/bcrypt.adapter';
import { User } from '@auth/entities/user.entity';
import envConfiguration from '@config/app.config';
import { initialData } from './data/seed-data';
import { Environment } from '@common/enums/enviroment.enum';

@Injectable()
export class SeedService {
  constructor(
    private readonly productsService: ProductsService,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly encrypt: BcryptAdapter,
    @Inject(envConfiguration.KEY)
    private readonly config: ConfigType<typeof envConfiguration>,
  ) {}

  async runSeed() {
    if (this.config.environment === Environment.PRODUCTION) {
      return "Seed can't execute in production";
    }

    await this.deleteTables();
    const adminUser = await this.insertUsers();
    await this.insertProducts(adminUser);

    return 'Seed executed successfully';
  }

  private async deleteTables() {
    await this.productsService.deleteAll();

    const queryBuilder = this.userRepository.createQueryBuilder();
    await queryBuilder.delete().where({}).execute();
  }

  private async insertProducts(user: User) {
    const { products } = initialData;

    const insertProducts = products.map((product) =>
      this.productsService.create(product, user),
    );

    await Promise.all(insertProducts);
  }

  private async insertUsers() {
    const { users } = initialData;

    const insertUsers = users.map((user) =>
      this.userRepository.create({
        ...user,
        password: this.encrypt.hashSync(user.password, 10),
      }),
    );

    await this.userRepository.save(insertUsers);

    return insertUsers[0];
  }
}
