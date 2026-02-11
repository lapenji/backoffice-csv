import { z } from "zod";

export const discountTypeEnum = z.enum(["none", "percentage", "amount"]);

export const updateProductSchema = z
  .object({
    name: z.string().min(1, "Product name is required").optional(),
    description: z.string().optional(),
    price: z
      .number({ error: "Please enter a valid number" })
      .positive("Price must be greater than zero")
      .optional(),
    discountType: discountTypeEnum.optional(),
    discount: z
      .number({ error: "Please enter a valid number" })
      .nonnegative("Discount cannot be negative")
      .optional(),
  })
  .superRefine((data, ctx) => {
    const { discountType, discount, price } = data;

    if (
      (discountType && discount === undefined) ||
      (discount !== undefined && !discountType)
    ) {
      ctx.addIssue({
        code: "custom",
        message: "Both discount type and discount value must be set",
        path: ["discountType"],
      });
    }

    if (
      discountType === "percentage" &&
      discount !== undefined &&
      discount > 100
    ) {
      ctx.addIssue({
        code: "custom",
        message: "Discount percentage cannot be greater than 100%",
        path: ["discount"],
      });
    }

    if (
      discountType === "amount" &&
      discount !== undefined &&
      price !== undefined &&
      discount >= price
    ) {
      ctx.addIssue({
        code: "custom",
        message: "Discount cannot be greater than or equal to price",
        path: ["discount"],
      });
    }

    if (discountType === "none" && discount !== undefined && discount !== 0) {
      ctx.addIssue({
        code: "custom",
        message: 'Discount must be 0 when discount type is "none"',
        path: ["discount"],
      });
    }
  });

export type UpdateProductFormValues = z.infer<typeof updateProductSchema>;
