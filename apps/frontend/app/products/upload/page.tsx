"use client";

import ProductCsvUploadForm from "@/components/ProductCsvUploadForm";

export default function ProductCsvUploadPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Import Products via CSV</h1>
      <p className="text-gray-600">
        Select a CSV file to upload products. The file must contain the columns:{" "}
        <code>name, description, price, discount, discountType</code>.
      </p>

      <ProductCsvUploadForm
        onSuccess={(result) => {
          console.log("CSV upload result:", result);
        }}
      />
    </div>
  );
}
