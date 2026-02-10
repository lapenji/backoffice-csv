import { IsEnum, IsNumber, IsOptional, Validate } from 'class-validator';
import { DiscountType } from 'generated/prisma/enums';
import { PatchDiscountValidator } from '../validators/patch-discount.validator';

export class UpdateProductDto {
  @IsOptional()
  name?: string;

  @IsOptional()
  description?: string;

  @IsOptional()
  @IsNumber()
  price?: number;

  @IsOptional()
  @IsEnum(DiscountType)
  discountType?: DiscountType;

  @IsOptional()
  @IsNumber()
  discount?: number;

  @Validate(PatchDiscountValidator)
  checkDiscount?: any;
}
