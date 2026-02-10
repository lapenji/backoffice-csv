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
import {
  ApiBody,
  ApiConsumes,
  ApiOkResponse,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { FileUploadDto } from './dto/create-file.dto';
import { ImportResponseDto } from './dto/import-response.dto';
import { PaginatedProductsResponseDto } from './dto/paginated-product-response.dto';
import { ProductsService } from './products.service';

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiOkResponse({
    description: 'List of products with pagination',
    type: PaginatedProductsResponseDto,
  })
  async findAll(@Query('page') page = '1', @Query('limit') limit = '20') {
    return this.productsService.findAll(Number(page), Number(limit));
  }

  @Post('import')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'CSV file to import products',
    type: FileUploadDto,
  })
  @ApiOkResponse({
    description: 'CSV file import results',
    type: ImportResponseDto,
  })
  @UseInterceptors(FileInterceptor('file'))
  async importProducts(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('csv file is mandatory!');
    }
    const MAX_SIZE = 5 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      throw new BadRequestException('File too large. Max 5MB allowed.');
    }

    if (file.mimetype !== 'text/csv') {
      throw new BadRequestException(
        'Invalid file type. Only CSV files are allowed.',
      );
    }

    const csv = file.buffer.toString('utf-8');

    return this.productsService.importFromCsv(csv);
  }
}
