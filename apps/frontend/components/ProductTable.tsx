import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { IProduct } from "@/types/types";

interface Props {
  products: IProduct[];
}

export default function ProductsTable({ products }: Props) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nome</TableHead>
          <TableHead>Descrizione</TableHead>
          <TableHead className="w-30">Prezzo</TableHead>
          <TableHead className="w-30">Sconto</TableHead>
          <TableHead className="w-35">Prezzo Finale</TableHead>
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
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
