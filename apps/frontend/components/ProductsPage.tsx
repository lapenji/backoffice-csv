"use client";

import PageSizeSelector from "@/components/PageSizeSelector";
import PaginationControls from "@/components/PaginationControls";
import ProductsTable from "@/components/ProductTable";
import { Button } from "@/components/ui/button";
import { getProducts } from "@/lib/api/products";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import useSWR from "swr";

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const page = Number(searchParams.get("page") ?? 1);
  const limit = Number(searchParams.get("limit") ?? 10);

  const { data, error, isLoading } = useSWR(
    ["products", page, limit],
    () => getProducts(page, limit),
    { keepPreviousData: true },
  );

  const handlePageChange = (newPage: number) => {
    router.push(`/?page=${newPage}&limit=${limit}`);
  };

  const handleLimitChange = (newLimit: number) => {
    router.push(`/?page=1&limit=${newLimit}`);
  };

  if (error) {
    console.log("ERRORE", error);
    return <p>error loading products</p>;
  }
  if (isLoading) {
    return <p>loading...</p>;
  }

  if (data?.data && data.data.length < 1) {
    return (
      <div className="p-6 border rounded bg-gray-50 text-center space-y-4">
        <p className="text-gray-700">No products in db.</p>
        <Link href="/products/upload">
          <Button>Add products</Button>
        </Link>
      </div>
    );
  }
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-semibold">Products</h1>

        <PageSizeSelector value={limit} onChange={handleLimitChange} />
      </div>
      <ProductsTable products={data?.data || []} page={page} />

      {data && data.totalPages > 1 && (
        <PaginationControls
          page={page}
          totalPages={data.totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
}
