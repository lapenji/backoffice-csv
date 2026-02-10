import { ApiProperty } from '@nestjs/swagger';

export class ImportErrorDto {
  @ApiProperty({ description: 'Row number in the CSV file' })
  rowNumber: number;

  @ApiProperty({ description: 'Error message describing why the row failed' })
  errorMessage: string;
}
