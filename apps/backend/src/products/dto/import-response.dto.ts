import { ApiProperty } from '@nestjs/swagger';
import { ImportErrorDto } from './import-error.dto';

export class ImportResponseDto {
  @ApiProperty({ description: 'Number of products successfully created' })
  created: number;

  @ApiProperty({ description: 'Number of products successfully updated' })
  updated: number;

  @ApiProperty({
    description: 'List of rows that failed validation',
    type: [ImportErrorDto],
  })
  errors: ImportErrorDto[];
}
