"use client";

import PageSizeSelector from "@/components/PageSizeSelector";
import PaginationControls from "@/components/PaginationControls";
import ProductsTable from "@/components/ProductTable";
import { getProducts } from "@/lib/api/products";
import { useRouter, useSearchParams } from "next/navigation";
import useSWR from "swr";

export default function Home() {
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
    return <p>errore</p>;
  }
  if (isLoading) {
    return <p>loading...</p>;
  }
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-semibold">Prodotti</h1>

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
