"use client";

import { Button } from "@/components/ui/button";
import { useDeleteProduct } from "@/hooks/useDeleteProduct";
import { Edit, Trash } from "lucide-react";
import Link from "next/link";

interface Props {
  productId: number;
  productName: string;
  page?: number;
}

export default function ProductActions({
  productId,
  productName,
  page,
}: Props) {
  const { handleDelete, isDeleting } = useDeleteProduct();

  return (
    <div className="flex justify-center gap-2">
      <Link href={`/backoffice/products/${productId}`}>
        <Button size="sm" variant="outline">
          <Edit />
        </Button>
      </Link>

      <Button
        size="sm"
        variant="destructive"
        onClick={() => handleDelete(productId, productName, page)}
        disabled={isDeleting}
      >
        <Trash />
      </Button>
    </div>
  );
}
