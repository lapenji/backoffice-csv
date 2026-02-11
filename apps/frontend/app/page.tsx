"use client";

import ProductsPage from "@/components/ProductsPage";
import { Suspense } from "react";

export default function Home() {
  return (
    <Suspense fallback={<p>Loading page...</p>}>
      <ProductsPage />
    </Suspense>
  );
}
