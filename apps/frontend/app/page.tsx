"use client";

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
      {data?.data.map((p) => (
        <h1>{p.name}</h1>
      ))}
    </div>
  );
}
