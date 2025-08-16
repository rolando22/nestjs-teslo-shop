import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsIn,
  IsInt,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateProductDto {
  @ApiProperty({
    description: 'Product title',
    nullable: false,
    minLength: 1,
    type: String,
    uniqueItems: true,
  })
  @IsString()
  @MinLength(1)
  title: string;

  @ApiProperty({
    description: 'Product price',
    type: Number,
    required: false,
  })
  @IsNumber()
  @IsPositive()
  @IsOptional()
  price?: number;

  @ApiProperty({
    description: 'Product description',
    type: String,
    nullable: true,
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'Product SLUG - for SEO',
    type: String,
    uniqueItems: true,
    required: false,
  })
  @IsString()
  @IsOptional()
  slug?: string;

  @ApiProperty({
    description: 'Product stock',
    type: String,
    required: false,
  })
  @IsInt()
  @IsPositive()
  @IsOptional()
  stock?: number;

  @ApiProperty({
    description: 'Product sizes',
    type: String,
    isArray: true,
    enum: ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'],
  })
  @IsString({ each: true })
  @IsArray()
  @IsIn(['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'], { each: true })
  sizes: string[];

  @ApiProperty({
    description: 'Product gender',
    type: String,
    enum: ['men', 'women', 'kid', 'unisex'],
  })
  @IsIn(['men', 'women', 'kid', 'unisex'])
  gender: string;

  @ApiProperty({
    description: 'Product tags',
    type: String,
    isArray: true,
    required: false,
  })
  @IsString({ each: true })
  @IsArray()
  @IsOptional()
  tags?: string[];

  @ApiProperty({
    description: 'Product images url',
    type: String,
    isArray: true,
    required: false,
  })
  @IsString({ each: true })
  @IsArray()
  @IsOptional()
  images?: string[];
}
