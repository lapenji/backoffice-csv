import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { DiscountType } from 'generated/prisma/enums';

interface PatchDiscountContext {
  discountType?: DiscountType;
  discount?: number;
  price?: number;
}

@ValidatorConstraint({ name: 'PatchDiscountValidator', async: false })
export class PatchDiscountValidator implements ValidatorConstraintInterface {
  validate(_: any, args: ValidationArguments): boolean {
    const obj = args.object as PatchDiscountContext;
    const { discountType, discount, price } = obj;

    const hasType = discountType !== undefined;
    const hasDiscount = discount !== undefined;

    if (!hasType && !hasDiscount) return true;

    if (hasType && !hasDiscount) return false;
    if (!hasType && hasDiscount) return false;

    if (typeof discount !== 'number' || isNaN(discount)) return false;

    switch (discountType) {
      case DiscountType.none:
        return discount === 0;
      case DiscountType.percentage:
        return discount <= 99;
      case DiscountType.amount:
        if (price === undefined || typeof price !== 'number') return false;
        return discount < price;
      default:
        return false;
    }
  }

  defaultMessage(args: ValidationArguments): string {
    const obj = args.object as PatchDiscountContext;
    const { discountType, discount, price } = obj;

    if (
      (discountType && discount === undefined) ||
      (!discountType && discount !== undefined)
    ) {
      return 'discountType and discount must be provided together';
    }

    if (discountType === DiscountType.amount && price === undefined) {
      return 'price must be provided when discountType is amount';
    }

    if (discountType === DiscountType.none && discount !== 0) {
      return 'Discount must be 0 when discountType is none';
    }

    if (discountType === DiscountType.percentage && discount! > 99) {
      return `Percentage discount cannot exceed 99 (got ${discount})`;
    }

    if (discountType === DiscountType.amount && discount! >= price!) {
      return `Discount amount (${discount}) must be less than price (${price})`;
    }

    return 'Invalid discount configuration';
  }
}
