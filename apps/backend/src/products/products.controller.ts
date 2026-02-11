import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
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
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { FileUploadDto } from './dto/create-file.dto';
import { ImportResponseDto } from './dto/import-response.dto';
import { PaginatedProductsResponseDto } from './dto/paginated-product-response.dto';
import { DeleteProductResponseDto } from './dto/product-delete.dto';
import { ProductResponseDto } from './dto/product-response.dto';
import { UpdateProductDto } from './dto/update-product.dto';
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

  @Get(':id')
  @ApiParam({ name: 'id', type: Number, description: 'Product ID' })
  @ApiOkResponse({ description: 'Single product', type: ProductResponseDto })
  async getOne(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.getProductById(id);
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

  @Delete(':id')
  @ApiParam({ name: 'id', description: 'Product ID', type: Number })
  @ApiOkResponse({
    description: 'Result of delete operation',
    type: DeleteProductResponseDto,
  })
  async delete(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.deleteProduct(id);
  }

  @Patch(':id')
  @ApiParam({ name: 'id', type: Number, description: 'Product ID' })
  @ApiBody({ type: UpdateProductDto })
  async updateProduct(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateProductDto,
  ) {
    return this.productsService.update(id, data);
  }
}
