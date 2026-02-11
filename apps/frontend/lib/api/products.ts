import { IFetchProductsResponse } from "@/types/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL!;
export async function getProducts(page: number, limit: number) {
  const res = await fetch(`${API_URL}/products?page=${page}&limit=${limit}`, {
    credentials: "include",
  });

  if (!res.ok) throw new Error("Errore nel fetch prodotti");

  const data = await res.json();

  return data as IFetchProductsResponse;
}
