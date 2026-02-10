import { ApiProperty } from '@nestjs/swagger';

export class DeleteProductResponseDto {
  @ApiProperty({ example: 1, description: 'Number of records deleted' })
  deleted: number;

  @ApiProperty({
    example: 'Product deleted successfully',
    description: 'Optional message about the operation',
  })
  message?: string;
}
