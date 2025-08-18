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
import { ApiBearerAuth, ApiResponse, getSchemaPath } from '@nestjs/swagger';

import { ProductsService } from './products.service';
import { Product } from './entities';
import { User } from '@auth/entities/user.entity';
import { CreateProductDto, FilterProductDto, UpdateProductDto } from './dto';
import { Auth, GetUser } from '@auth/decorators';
import { Role } from '@auth/enums/role.enum';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  @ApiResponse({
    status: 200,
    description: 'Get all products.',
    schema: {
      type: 'object',
      properties: {
        data: {
          properties: {
            count: {
              type: 'number',
              example: 50,
            },
            pages: {
              type: 'number',
              example: 10,
            },
            products: {
              type: 'array',
              items: { $ref: getSchemaPath(Product) },
            },
          },
        },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  async findAll(
    @Query() filterProductDto: FilterProductDto,
  ): Promise<{ data: { count: number; pages: number; products: Product[] } }> {
    const data = await this.productsService.findAll(filterProductDto);

    return {
      data,
    };
  }

  @Get(':term')
  @ApiResponse({
    status: 200,
    description: 'Get one product.',
    schema: {
      type: 'object',
      properties: {
        data: { $ref: getSchemaPath(Product) },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Product not found.' })
  async findOne(@Param('term') term: string): Promise<{ data: Product }> {
    const product = await this.productsService.findOne(term);

    return {
      data: product,
    };
  }

  @Post()
  @Auth(Role.ADMIN)
  @ApiBearerAuth('access-token')
  @ApiResponse({
    status: 201,
    description: 'Create product.',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Product created successfully' },
        data: { $ref: getSchemaPath(Product) },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiResponse({
    status: 403,
    description:
      'Forbidden. Invalid token. Only ADMIN role can access this endpoint.',
  })
  async create(
    @Body() createProductDto: CreateProductDto,
    @GetUser() user: User,
  ): Promise<{ message: string; data: Product }> {
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
  @Auth(Role.ADMIN)
  @ApiBearerAuth('access-token')
  @ApiResponse({
    status: 200,
    description: 'Updated product.',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Product updated successfully' },
        data: { $ref: getSchemaPath(Product) },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiResponse({
    status: 403,
    description:
      'Forbidden. Invalid token. Only ADMIN role can access this endpoint.',
  })
  @ApiResponse({ status: 404, description: 'Product not found.' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateProductDto: UpdateProductDto,
    @GetUser() user: User,
  ): Promise<{ message: string; data: Product }> {
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
  @ApiBearerAuth('access-token')
  @ApiResponse({
    status: 200,
    description: 'Delete product.',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Product deleted successfully' },
        data: { $ref: getSchemaPath(Product) },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiResponse({
    status: 403,
    description:
      'Forbidden. Invalid token. Only ADMIN role can access this endpoint.',
  })
  @ApiResponse({ status: 404, description: 'Product not found.' })
  async remove(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<{ message: string; data: Product }> {
    const product = await this.productsService.remove(id);

    return {
      message: 'Product deleted successfully',
      data: product,
    };
  }
}
