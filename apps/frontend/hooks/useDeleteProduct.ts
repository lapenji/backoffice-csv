"use client";

import { deleteProduct } from "@/lib/api/products";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { mutate } from "swr";

export function useDeleteProduct() {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  const page = Number(searchParams.get("page") ?? 1);
  const limit = Number(searchParams.get("limit") ?? 10);

  const handleDelete = async (
    id: number,
    productName: string,
    itemsOnPage?: number,
  ) => {
    if (!window.confirm(`Are you sure you want to delete ${productName}`))
      return; //DA CAMBIARE CON DIALOG

    try {
      setIsDeleting(true);
      await deleteProduct(id);
      const isLastItemOnPage = itemsOnPage === 1;

      if (isLastItemOnPage && page > 1) {
        router.replace(`/?page=${page - 1}&limit=${limit}`);
      } else {
        mutate(["products", page, limit]);
      }

      alert("PRODUCT DELETE SUCCESFULLY"); //DA CAMBIARE IN DIALOG
    } catch (error) {
      console.log(error);
      alert("Error deleting product");
    } finally {
      setIsDeleting(false);
    }
  };

  return { handleDelete, isDeleting };
}
