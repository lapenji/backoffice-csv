"use client";

import PaginationControls from "@/components/PaginationControls";
import ProductsTable from "@/components/ProductTable";
import { getProducts } from "@/lib/api/products";
import { useState } from "react";
import useSWR from "swr";

export default function Home() {
  const [page, setPage] = useState(1);
  const limit = 10;
  const { data, error, isLoading } = useSWR(
    ["products", page],
    () => getProducts(page, limit),
    {
      keepPreviousData: true,
    },
  );

  if (error) {
    console.log("ERRORE", error);
    return <p>errore</p>;
  }
  if (isLoading) {
    return <p>loading...</p>;
  }
  return (
    <div>
      <ProductsTable products={data?.data || []} />

      {data && data.totalPages > 1 && (
        <PaginationControls
          page={page}
          totalPages={data.totalPages}
          onPageChange={setPage}
        />
      )}
    </div>
  );
}
