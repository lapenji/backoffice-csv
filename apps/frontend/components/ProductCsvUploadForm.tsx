"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { uploadProductCsv } from "@/lib/api/products";
import { CSVUploadResponse } from "@/types/types";
import { useState } from "react";
import { useForm } from "react-hook-form";

interface ProductCsvUploadFormProps {
  onSuccess?: (result: CSVUploadResponse) => void;
}

interface FormValues {
  file: FileList | null;
}

export default function ProductCsvUploadForm({
  onSuccess,
}: ProductCsvUploadFormProps) {
  const form = useForm<FormValues>({
    defaultValues: {
      file: null,
    },
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CSVUploadResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (values: FormValues) => {
    const file = values.file?.[0];
    if (!file) return setError("Please select a CSV file");

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await uploadProductCsv(file);
      setResult(data);
      onSuccess?.(data);
    } catch (err: any) {
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl p-4 space-y-6 border rounded bg-gray-50">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="file"
            render={({ field }) => (
              <FormItem>
                <FormLabel>CSV File</FormLabel>
                <FormControl>
                  <Input
                    type="file"
                    accept=".csv,text/csv"
                    onChange={(e) => field.onChange(e.target.files)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" disabled={loading}>
            {loading ? "Uploading..." : "Upload CSV"}
          </Button>
        </form>
      </Form>

      {error && <p className="text-red-500 font-medium">{error}</p>}

      {result && (
        <div className="p-4 border rounded space-y-2 bg-white">
          <p>Created: {result.created}</p>
          <p>Updated: {result.updated}</p>
          {result.errors.length > 0 && (
            <div>
              <p className="font-semibold">Errors:</p>
              <ul className="list-disc ml-5">
                {result.errors.map((err) => (
                  <li key={err.rowNumber}>
                    Row {err.rowNumber}: {err.errorMessage}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
