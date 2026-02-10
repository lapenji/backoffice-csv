import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';
import { parse } from 'csv-parse/sync';
import { CreateProductDto } from '../dto/create-product.dto';

export interface CsvRowError {
  rowNumber: number;
  errorMessage: string;
}

export interface RawCsvProductRow {
  name?: string;
  description?: string;
  price?: string;
  discount?: string;
  discountType?: string;
}

const REQUIRED_COLUMNS = [
  'name',
  'description',
  'price',
  'discount',
  'discountType',
];

export function parseProductCsv(csv: string) {
  let records: RawCsvProductRow[] = [];

  try {
    records = parse(csv, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
      relax_column_count: false,
    });
  } catch (error) {
    throw new Error(`Invalid CSV file, ${error.message}`);
  }

  if (records.length === 0) {
    throw new Error('CSV file contains zero rows');
  }

  const firstRow = records[0];

  const columns = Object.keys(firstRow);

  if (columns.length !== REQUIRED_COLUMNS.length) {
    throw new Error(
      `Invalid number of columns. Expected ${REQUIRED_COLUMNS.length} (${REQUIRED_COLUMNS.join(', ')}), got ${columns.length} (${columns.join(', ')})`,
    );
  }

  for (let i = 0; i < REQUIRED_COLUMNS.length; i++) {
    if (columns[i] !== REQUIRED_COLUMNS[i]) {
      throw new Error(
        `Invalid column header at position ${i + 1}. Expected "${REQUIRED_COLUMNS[i]}", got "${columns[i]}"`,
      );
    }
  }

  const validProducts: CreateProductDto[] = [];
  const errors: CsvRowError[] = [];

  records.forEach((row, idx) => {
    const rowNumber = idx + 2;

    if (
      row.discount?.trim() === '' &&
      (row.discountType === 'percentage' || row.discountType === 'amount')
    ) {
      errors.push({
        rowNumber,
        errorMessage:
          'Discount is required for percentage and amount discount types',
      });
      return;
    }

    const processedRow = {
      ...row,
      discount:
        row.discountType === 'none' && row.discount === '' ? '0' : row.discount,
    };

    const dto = plainToInstance(CreateProductDto, processedRow, {
      enableImplicitConversion: true,
    });

    const validationErrors = validateSync(dto);

    if (validationErrors.length > 0) {
      const messages: string[] = [];

      for (const err of validationErrors) {
        if (err.constraints) {
          messages.push(...Object.values(err.constraints));
        }
      }
      errors.push({
        rowNumber,
        errorMessage: messages.join(', '),
      });

      return;
    }

    validProducts.push(dto);
  });

  return { validProducts, errors };
}
