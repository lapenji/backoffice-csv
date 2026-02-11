"use client";

import ProductEditForm from "@/components/ProductEditForm";
import { getProduct, updateProduct } from "@/lib/api/products";
import { useParams, useRouter } from "next/navigation";
import useSWR from "swr";

export default function ProductPage() {
  const router = useRouter();
  const { id } = useParams();

  if (!id) {
    router.replace("/");
    return null;
  }

  const {
    data: product,
    error,
    isLoading,
    mutate, // <-- serve per aggiornare SWR
  } = useSWR(["product", id], () => getProduct(Number(id)));

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading product</p>;
  if (!product) return <p>Product not found</p>;

  const handleSubmit = async (data: Parameters<typeof updateProduct>[1]) => {
    try {
      const updated = await updateProduct(Number(id), data);

      mutate(updated, { revalidate: false });

      alert("Product updated successfully!");
    } catch (err: any) {
      alert(err.message || "Error updating product");
    }
  };

  return (
    <div>
      <ProductEditForm product={product} onSubmit={handleSubmit} />
    </div>
  );
}
