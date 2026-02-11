import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { IProduct } from "@/types/types";
import ProductActions from "./ProductActions";

interface Props {
  products: IProduct[];
  page?: number;
}

export default function ProductsTable({ products, page }: Props) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Description</TableHead>
          <TableHead className="w-30">Price</TableHead>
          <TableHead className="w-30">Discount</TableHead>
          <TableHead className="w-35">Final price</TableHead>
          <TableHead className="w-35">Actions</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {products.map((p) => (
          <TableRow key={p.id}>
            <TableCell className="font-medium">{p.name}</TableCell>
            <TableCell>{p.description}</TableCell>
            <TableCell>€ {p.price.toFixed(2)}</TableCell>

            <TableCell>
              {p.discountType === "none"
                ? "-"
                : p.discountType === "percentage"
                  ? `${p.discount}%`
                  : `€ ${p.discount.toFixed(2)}`}
            </TableCell>

            <TableCell className="font-semibold">
              € {p.finalPrice.toFixed(2)}
            </TableCell>
            <TableCell>
              <ProductActions
                productId={p.id}
                productName={p.name}
                page={page}
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
