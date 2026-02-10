import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { parseProductCsv } from './utils/csv-parser';

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}
  async importFromCsv(csv: string) {
    try {
      const { validProducts, errors } = parseProductCsv(csv);
      if (validProducts.length > 0) {
        await this.prisma.product.createMany({
          data: validProducts,
        });
        return {
          inserted: validProducts.length,
          errors,
        };
      }
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
