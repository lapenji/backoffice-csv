"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="flex p-4 px-8 border-b bg-gray-50 justify-between items-center w-full">
      <h1>Ecommerce Backoffice</h1>
      <div className="flex gap-4">
        <Link href="/">
          <Button variant="outline" size="sm">
            Products
          </Button>
        </Link>
        <Link href="/products/upload">
          <Button variant="outline" size="sm">
            Upload Products
          </Button>
        </Link>
      </div>
    </nav>
  );
}
