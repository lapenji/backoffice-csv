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
import { ApiBody, ApiConsumes, ApiQuery, ApiTags } from '@nestjs/swagger';
import { FileUploadDto } from './dto/create-file.dto';
import { ProductsService } from './products.service';

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async findAll(@Query('page') page = '1', @Query('limit') limit = '20') {
    return this.productsService.findAll(Number(page), Number(limit));
  }

  @Post('import')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'CSV file to import products',
    type: FileUploadDto,
  })
  @UseInterceptors(FileInterceptor('file'))
  async importProducts(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('csv file is mandatory!');
    }

    const csv = file.buffer.toString('utf-8');

    return this.productsService.importFromCsv(csv);
  }
}
