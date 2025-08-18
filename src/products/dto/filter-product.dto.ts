import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsOptional, IsString } from 'class-validator';

import { PaginationDto } from '@common/dtos/pagination.dto';

export class FilterProductDto extends PaginationDto {
  @ApiProperty({
    default: '',
    description: 'Filter products by title',
  })
  @IsOptional()
  @IsString()
  title?: string;
  @ApiProperty({
    default: '',
    description: 'Filter products by gender',
  })
  @IsOptional()
  @IsIn(['men', 'women', 'unisex', 'kid'])
  gender?: 'men' | 'women' | 'unisex' | 'kid';
}
