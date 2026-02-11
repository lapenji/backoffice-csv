import {
  CSVUploadResponse,
  IDeleteProductResponse,
  IFetchProductsResponse,
  IProduct,
} from "@/types/types";
import { UpdateProductFormValues } from "../schemas/product";

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
  if (!res.ok) throw new Error("Error deleting product");

  const data = await res.json();
  return data as IDeleteProductResponse;
}

export async function getProduct(id: number) {
  const res = await fetch(`${API_URL}/products/${id}`);
  if (!res.ok) throw new Error("Error fetching product");

  const data = await res.json();

  return data as IProduct;
}

export async function updateProduct(
  id: number,
  updateData: UpdateProductFormValues,
) {
  const res = await fetch(`${API_URL}/products/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updateData),
  });

  if (!res.ok) throw new Error("Error fetching product");

  const data = await res.json();

  return data as IProduct;
}

export async function uploadProductCsv(file: File): Promise<CSVUploadResponse> {
  if (!file) throw new Error("No file provided");

  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${API_URL}/products/import`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => null);
    throw new Error(errData?.message || "Error uploading CSV");
  }

  const data = await res.json();
  return data as CSVUploadResponse;
}
