import {
  BadRequestException,
  Controller,
  Get,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  async findAll(@Query('page') page = '1', @Query('limit') limit = '20') {
    return this.productsService.findAll(Number(page), Number(limit));
  }

  @Post('import')
  @UseInterceptors(FileInterceptor('file'))
  async importProducts(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('csv file is mandatory!');
    }

    const csv = file.buffer.toString('utf-8');

    return this.productsService.importFromCsv(csv);
  }
}
