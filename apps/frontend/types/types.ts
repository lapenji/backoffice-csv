export interface IFetchProductsResponse {
  data: IProduct[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export type IDiscountType = "percentage" | "none" | "amount";

export interface IProduct {
  id: number;
  name: string;
  description?: string;
  price: number;
  discount: number;
  discountType: IDiscountType;
  finalPrice: number;
  createdAt: string;
}
