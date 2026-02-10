import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { parseProductCsv } from './utils/csv-parser';

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  async importFromCsv(csv: string) {
    try {
      const existingProducts = await this.prisma.product.findMany({
        select: { name: true },
      });

      const existingNames = new Set(
        existingProducts.map((p) => p.name.toLowerCase()),
      );
      const { validProducts, errors } = parseProductCsv(csv);

      const toCreate = validProducts.filter(
        (p) => !existingNames.has(p.name.toLowerCase()),
      );
      const toUpdate = validProducts.filter((p) =>
        existingNames.has(p.name.toLowerCase()),
      );
      if (toCreate.length > 0) {
        await this.prisma.product.createMany({
          data: toCreate,
        });
      }
      for (const row of toUpdate) {
        await this.prisma.product.updateMany({
          where: { name: row.name },
          data: {
            price: row.price,
            discount: row.discount,
            discountType: row.discountType,
            description: row.description,
          },
        });
      }
      return {
        created: toCreate.length,
        updated: toUpdate.length,
        errors,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findAll(page: number, limit: number) {
    const skip = (page - 1) * limit;

    const products = await this.prisma.product.findMany({
      skip,
      take: limit,
      orderBy: { id: 'asc' },
    });

    const total = await this.prisma.product.count();

    return {
      data: products,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    };
  }
}
