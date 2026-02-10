import { ApiProperty } from '@nestjs/swagger';
import { DiscountType } from './create-product.dto';

export class ProductResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'T-shirt' })
  name: string;

  @ApiProperty({ example: 'Red T-shirt size M', required: false })
  description: string | null;

  @ApiProperty({ example: 19.99 })
  price: number;

  @ApiProperty({ enum: DiscountType, example: DiscountType.percentage })
  discountType: DiscountType;

  @ApiProperty({ example: 10 })
  discount: number;

  @ApiProperty({ example: '2026-02-10T12:00:00Z' })
  createdAt: Date;
}
