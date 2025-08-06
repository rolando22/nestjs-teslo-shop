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
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginationDto } from '@common/dtos/pagination.dto';

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
  async create(@Body() createProductDto: CreateProductDto) {
    const newProduct = await this.productsService.create(createProductDto);

    return {
      message: 'Product created successfully',
      data: newProduct,
    };
  }

  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    const product = await this.productsService.update(id, updateProductDto);

    return {
      message: 'Product updated successfully',
      data: product,
    };
  }

  @Delete(':id')
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    const product = await this.productsService.remove(id);

    return {
      message: 'Product deleted successfully',
      data: product,
    };
  }
}
