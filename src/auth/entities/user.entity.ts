import { ApiProperty } from '@nestjs/swagger';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';

import { Product } from '@products/entities';
import { Role } from '@auth/enums/role.enum';

@Entity({ name: 'users' })
export class User {
  @ApiProperty({
    example: '28a846ca-9392-43ec-bffd-a3e8239d2ac2',
    description: 'User ID',
    type: String,
    uniqueItems: true,
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    example: 'test1@gmail.com',
    description: 'User email',
    type: String,
    uniqueItems: true,
  })
  @Column({ type: 'text', unique: true })
  email: string;

  @Exclude()
  @Column({ type: 'text' })
  password: string;

  @ApiProperty({
    example: 'Test One',
    description: 'User fullName',
    type: String,
  })
  @Column({ type: 'text' })
  fullName: string;

  @ApiProperty({
    example: true,
    description: 'User isActive',
    type: Boolean,
    default: true,
  })
  @Column({ type: 'bool', default: true })
  isActive: boolean;

  @ApiProperty({
    example: 'user',
    description: 'User role',
    type: String,
    enum: ['admin', 'super-user', 'user'],
    default: 'user',
  })
  @Column({ type: 'text', array: true, default: ['user'] })
  roles: Role[];

  @OneToMany(() => Product, (product) => product.user)
  products: Product[];

  @ApiProperty({
    example: '2025-08-14T23:18:05.731Z',
    description: 'Product creation',
    type: String,
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

  @BeforeInsert()
  @BeforeUpdate()
  checkFieldsBeforeInsertANdUpdate() {
    this.email = this.email.toLowerCase().trim();
  }
}
