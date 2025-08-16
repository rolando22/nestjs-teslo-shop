import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Product } from './';

@Entity({ name: 'products_images' })
export class ProductImage {
  @ApiProperty({
    example: 1,
    description: 'Product image ID',
    type: Number,
    uniqueItems: true,
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    example: 'http://localhost:3001/files/product/1740280-00-A_0_2000.jpg',
    description: 'Product image url',
    type: String,
  })
  @Column({ type: 'text' })
  url: string;

  @ManyToOne(() => Product, (product) => product.images, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'product_id' })
  product: Product;
}
