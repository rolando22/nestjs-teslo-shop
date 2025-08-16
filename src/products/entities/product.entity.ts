import { ApiProperty } from '@nestjs/swagger';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Exclude, Expose } from 'class-transformer';

import { ProductImage } from './';
import { User } from '@auth/entities/user.entity';

@Entity({ name: 'products' })
export class Product {
  @ApiProperty({
    example: '28a846ca-9392-43ec-bffd-a3e8239d2ac2',
    description: 'Product ID',
    uniqueItems: true,
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    example: 'Men’s 3D Small Wordmark Tee',
    description: 'Product title',
    uniqueItems: true,
  })
  @Column({ type: 'text', unique: true })
  title: string;

  @ApiProperty({ example: 10, description: 'Product price', default: 0 })
  @Column({ type: 'float', default: 0 })
  price: number;

  @ApiProperty({
    example:
      'Designed for comfort and style in any size, the Tesla Small Wordmark Tee is made from 100% Peruvian cotton and features a 3D silicone-printed wordmark on the left chest.',
    description: 'Product description',
    nullable: true,
  })
  @Column({ type: 'text', nullable: true })
  description: string;

  @ApiProperty({
    example: 'men_3d_small_wordmark_tee',
    description: 'Product SLUG - for SEO',
    uniqueItems: true,
  })
  @Column({ type: 'text', unique: true })
  slug: string;

  @ApiProperty({ example: 10, description: 'Product stock', default: 0 })
  @Column({ type: 'int', default: 0 })
  stock: number;

  @ApiProperty({ example: ['XS', 'S', 'M'], description: 'Product sizes' })
  @Column({ type: 'text', array: true })
  sizes: string[];

  @ApiProperty({ example: 'men', description: 'Product gender' })
  @Column({ type: 'text' })
  gender: string;

  @ApiProperty({ example: ['shirt'], description: 'Product tags', default: [] })
  @Column({ type: 'text', array: true, default: [] })
  tags: string[];

  @OneToMany(() => ProductImage, (productImage) => productImage.product, {
    cascade: true,
    eager: true,
  })
  @Exclude()
  images?: ProductImage[];

  @ManyToOne(() => User, (user) => user.products, { eager: true })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ApiProperty({
    example: '2025-08-14T23:18:05.731Z',
    description: 'Product creation',
    default: 'CURRENT_TIMESTAMP',
  })
  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @Exclude()
  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  @ApiProperty({
    example: ['8528839-00-A_0_2000.jpg', '8528839-00-A_2.jpg'],
    description: 'Product images url',
    default: [],
  })
  @Expose()
  get imagesUrl() {
    if (!this.images) return [];

    const imagesUrls = this.images.map((image) => image.url);

    return imagesUrls;
  }

  @BeforeInsert()
  checkSlugInsert() {
    if (!this.slug) {
      this.slug = this.title;
    }

    this.createSlug();
  }

  @BeforeUpdate()
  checkSlugUpdate() {
    this.createSlug();
  }

  private createSlug() {
    this.slug = this.slug
      .toLowerCase()
      .replaceAll(' ', '_')
      .replaceAll("'", '');
  }
}
