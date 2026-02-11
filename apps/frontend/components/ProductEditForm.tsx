"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  UpdateProductFormValues,
  updateProductSchema,
} from "@/lib/schemas/product";
import { IProduct } from "@/types/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

interface ProductFormProps {
  product: IProduct;
  onSubmit: (data: UpdateProductFormValues) => void;
}

export default function ProductForm({ product, onSubmit }: ProductFormProps) {
  const router = useRouter();
  const form = useForm<UpdateProductFormValues>({
    resolver: zodResolver(updateProductSchema),
    defaultValues: {
      name: product.name,
      description: product.description || "",
      price: product.price,
      discountType: product.discountType || "none",
      discount: product.discount ?? 0,
    },
  });

  const discountType = form.watch("discountType");
  const discountError = form.formState.errors.discount?.message;

  const [priceInput, setPriceInput] = useState<string>(
    form.getValues("price")?.toString() ?? "",
  );
  const [discountInput, setDiscountInput] = useState<string>(
    form.getValues("discount")?.toString() ?? "",
  );

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Name */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Description */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Price */}
        <FormField
          control={form.control}
          name="price"
          render={({ field: { onChange, ...fieldProps } }) => (
            <FormItem>
              <FormLabel>Price (€)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="0.01"
                  {...fieldProps}
                  value={priceInput}
                  onChange={(e) => setPriceInput(e.target.value)}
                  onBlur={() => {
                    const parsed = parseFloat(priceInput);
                    onChange(isNaN(parsed) ? undefined : parsed);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Discount Type */}
        <FormField
          control={form.control}
          name="discountType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Discount Type</FormLabel>
              <Select
                defaultValue={field.value}
                onValueChange={(value) => {
                  field.onChange(value);
                  if (value === "none") {
                    form.setValue("discount", 0);
                    setDiscountInput("0");
                  }
                }}
              >
                <FormControl>
                  <SelectTrigger
                    className={discountError ? "border-red-500" : ""}
                  >
                    <SelectValue placeholder="Select discount type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="percentage">Percentage</SelectItem>
                  <SelectItem value="amount">Amount</SelectItem>
                </SelectContent>
              </Select>
              {discountError && (
                <p className="text-sm font-medium text-destructive">
                  {discountError}
                </p>
              )}
            </FormItem>
          )}
        />

        {/* Discount */}
        {discountType && discountType !== "none" && (
          <FormField
            control={form.control}
            name="discount"
            render={({ field: { onChange, ...fieldProps } }) => (
              <FormItem>
                <FormLabel>
                  Discount {discountType === "percentage" ? "(%)" : "(€)"}
                </FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step={discountType === "percentage" ? "1" : "0.01"}
                    {...fieldProps}
                    value={discountInput}
                    onChange={(e) => setDiscountInput(e.target.value)}
                    onBlur={() => {
                      const parsed = parseFloat(discountInput);
                      onChange(isNaN(parsed) ? undefined : parsed);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        <div className="flex gap-4">
          <Button type="submit">Update</Button>
          <Button
            variant="secondary"
            type="button"
            onClick={() => router.back()}
          >
            Back
          </Button>
        </div>
      </form>
    </Form>
  );
}
