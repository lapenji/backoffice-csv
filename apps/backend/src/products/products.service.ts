import { BadRequestException, Injectable } from '@nestjs/common';
import { parseProductCsv } from './utils/csv-parser';

@Injectable()
export class ProductsService {
  importFromCsv(csv: string) {
    try {
      const { validProducts, errors } = parseProductCsv(csv);

      return {
        totalRows: validProducts.length + errors.length,
        validRows: validProducts.length,
        errorRows: errors.length,
        errors,
        validProducts,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
