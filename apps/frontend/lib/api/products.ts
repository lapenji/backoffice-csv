import { IDeleteProductResponse, IFetchProductsResponse } from "@/types/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL!;
export async function getProducts(page: number, limit: number) {
  const res = await fetch(`${API_URL}/products?page=${page}&limit=${limit}`);

  if (!res.ok) throw new Error("Error fetching products");

  const data = await res.json();

  return data as IFetchProductsResponse;
}

export async function deleteProduct(id: number) {
  const res = await fetch(`${API_URL}/products/${id}`, {
    method: "DELETE",
  });
  console.log("RES", res);
  if (!res.ok) throw new Error("Error deleting product");

  const data = await res.json();
  console.log("DATA", data);
  return data as IDeleteProductResponse;
}
