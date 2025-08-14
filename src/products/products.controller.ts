import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  Query,
} from '@nestjs/common';

import { ProductsService } from './products.service';
import { CreateProductDto, UpdateProductDto } from './dto';
import { User } from '@auth/entities/user.entity';
import { PaginationDto } from '@common/dtos/pagination.dto';
import { Auth, GetUser } from '@auth/decorators';
import { Role } from '@auth/enums/role.enum';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  async findAll(@Query() paginationDto: PaginationDto) {
    const products = await this.productsService.findAll(paginationDto);

    return {
      data: products,
    };
  }

  @Get(':term')
  async findOne(@Param('term') term: string) {
    const product = await this.productsService.findOne(term);

    return {
      data: product,
    };
  }

  @Post()
  @Auth()
  async create(
    @Body() createProductDto: CreateProductDto,
    @GetUser() user: User,
  ) {
    const newProduct = await this.productsService.create(
      createProductDto,
      user,
    );

    return {
      message: 'Product created successfully',
      data: newProduct,
    };
  }

  @Patch(':id')
  @Auth()
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateProductDto: UpdateProductDto,
    @GetUser() user: User,
  ) {
    const product = await this.productsService.update(
      id,
      updateProductDto,
      user,
    );

    return {
      message: 'Product updated successfully',
      data: product,
    };
  }

  @Delete(':id')
  @Auth(Role.ADMIN)
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    const product = await this.productsService.remove(id);

    return {
      message: 'Product deleted successfully',
      data: product,
    };
  }
}
