"use client";

import { deleteProduct } from "@/lib/api/products";
import { useState } from "react";
import { mutate } from "swr";

export function useDeleteProduct() {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async (
    id: number,
    productName: string,
    page?: number,
  ) => {
    if (!window.confirm(`Are you sure you want to delete ${productName}`))
      return; //DA CAMBIARE CON DIALOG

    try {
      setIsDeleting(true);
      await deleteProduct(id);

      if (page !== undefined) {
        mutate(["products", page]);
      } else {
        mutate(["products"]);
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
