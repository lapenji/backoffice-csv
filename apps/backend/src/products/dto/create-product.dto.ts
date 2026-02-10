import { Type } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  Validate,
} from 'class-validator';
import { DiscountValidator } from '../validators/discount.validator';

export enum DiscountType {
  none = 'none',
  percentage = 'percentage',
  amount = 'amount',
}

export class CreateProductDto {
  @IsString()
  @IsNotEmpty({ message: 'Name cannot be empty' })
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @Type(() => Number)
  @IsNumber(
    { allowInfinity: false, allowNaN: false },
    { message: 'Price must be a number' },
  )
  @Min(0.01, { message: 'Price must be at least 0.01' })
  price: number;

  @IsEnum(DiscountType, { message: 'Invalid discount type' })
  discountType: DiscountType;

  @Type(() => Number)
  @IsNumber(
    { allowInfinity: false, allowNaN: false },
    { message: 'Discount must be a number' },
  )
  @Min(0, { message: 'Discount cannot be negative' })
  @Validate(DiscountValidator)
  discount: number;
}
