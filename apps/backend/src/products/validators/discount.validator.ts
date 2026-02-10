import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { CreateProductDto, DiscountType } from '../dto/create-product.dto';

@ValidatorConstraint({ name: 'DiscountValidator', async: false })
export class DiscountValidator implements ValidatorConstraintInterface {
  validate(discount: number, args: ValidationArguments): boolean {
    const obj = args.object as CreateProductDto;
    const { discountType, price } = obj;

    if (isNaN(discount)) return false;

    if (discountType === DiscountType.none) {
      return discount === 0;
    }

    if (discountType === DiscountType.percentage) {
      return discount <= 99;
    }

    if (discountType === DiscountType.amount) {
      if (isNaN(price) || typeof price !== 'number') return false;
      return discount < price;
    }

    return true;
  }

  defaultMessage(args: ValidationArguments): string {
    const obj = args.object as CreateProductDto;
    const { discountType, price } = obj;
    const discount = args.value;

    if (isNaN(discount)) {
      return 'Discount must be a valid number';
    }

    if (discountType === DiscountType.none) {
      return 'Discount must be 0 when discountType is none';
    }

    if (discountType === DiscountType.percentage) {
      return `Percentage discount cannot exceed 99 (got ${discount})`;
    }

    if (discountType === DiscountType.amount) {
      return `Discount amount (${discount}) must be less than price (${price})`;
    }

    return 'Invalid discount';
  }
}
