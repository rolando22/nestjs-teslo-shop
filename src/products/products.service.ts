import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, FindOptionsWhere, ILike, In, Repository } from 'typeorm';

import { Product, ProductImage } from './entities';
import { CreateProductDto, FilterProductDto, UpdateProductDto } from './dto';
import { User } from '@auth/entities/user.entity';

interface PostgresError extends Error {
  code: string;
  detail: string;
}

@Injectable()
export class ProductsService {
  private readonly logger = new Logger('ProductsService');

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(ProductImage)
    private readonly productImageRepository: Repository<ProductImage>,
    private readonly dataSource: DataSource,
  ) {}

  async findAll(
    filterProductDto: FilterProductDto,
  ): Promise<{ count: number; pages: number; products: Product[] }> {
    const { limit = 10, offset = 0, gender, title } = filterProductDto;

    const where: FindOptionsWhere<Product> = {};

    if (title) {
      where.title = ILike(`%${title}%`);
    }

    if (gender) {
      where.gender = In([gender, 'unisex']);
    }

    const products = await this.productRepository.find({
      where,
      take: limit,
      skip: offset,
    });

    const totalProducts = await this.productRepository.count({
      where,
    });

    return {
      count: totalProducts,
      pages: Math.ceil(totalProducts / limit),
      products,
    };
  }

  async findOne(term: string): Promise<Product> {
    let product: Product | null = null;

    if (this.isUUID(term)) {
      product = await this.productRepository.findOneBy({ id: term });
    } else {
      const queryBuilder = this.productRepository.createQueryBuilder();
      product = await queryBuilder
        .where('UPPER(title) =:title or slug =:slug', {
          title: term.toUpperCase(),
          slug: term.toLowerCase(),
        })
        .getOne();
    }

    if (!product) {
      throw new NotFoundException(`Product with "${term}" not found`);
    }

    return product;
  }

  async create(
    createProductDto: CreateProductDto,
    user: User,
  ): Promise<Product> {
    const { images = [], ...restCreateProductDto } = createProductDto;

    try {
      const product = this.productRepository.create({
        ...restCreateProductDto,
        images: images.map((image) =>
          this.productImageRepository.create({ url: image }),
        ),
        user,
      });
      await this.productRepository.save(product);

      return product;
    } catch (error) {
      throw this.handleExceptions(error as PostgresError);
    }
  }

  async update(
    id: string,
    updateProductDto: UpdateProductDto,
    user: User,
  ): Promise<Product> {
    const { images = [], ...restUpdateProductDto } = updateProductDto;

    const product = await this.productRepository.preload({
      id,
      ...restUpdateProductDto,
    });

    if (!product) {
      throw new NotFoundException(`Product with id "${id}" not found`);
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      if (images) {
        await queryRunner.manager.delete(ProductImage, { product: { id } });
        product.images = images.map((image) =>
          this.productImageRepository.create({ url: image }),
        );
      }

      product.user = user;
      const savedProduct = await queryRunner.manager.save(product);
      await queryRunner.commitTransaction();

      return savedProduct;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw this.handleExceptions(error as PostgresError);
    } finally {
      await queryRunner.release();
    }
  }

  async remove(id: string): Promise<Product> {
    const product = await this.findOne(id);
    await this.productRepository.remove(product);
    return product;
  }

  async deleteAll() {
    const queryBuilder = this.productRepository.createQueryBuilder('product');

    try {
      return await queryBuilder.delete().where({}).execute();
    } catch (error) {
      throw this.handleExceptions(error as PostgresError);
    }
  }

  private isUUID(id: string): boolean {
    const UUID_V4_REGEX =
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return UUID_V4_REGEX.test(id);
  }

  private handleExceptions(error: PostgresError) {
    if (error?.code === '23505') {
      return new BadRequestException(error?.detail);
    }
    // console.log(error);
    this.logger.error(error);
    return new InternalServerErrorException('Internal Server Error');
  }
}
