import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateWilayahDto {
  @ApiPropertyOptional({ example: 'uuid-wilayah-v4', description: 'ID Wilayah (Optional, untuk menghubungkan ke Wilayah yang sudah ada)' })
  @IsUUID()
  @IsOptional()
  id?: string;

  @ApiProperty({ example: 'Jakarta Barat', description: 'Nama wilayah pelayanan' })
  @IsString()
  @IsNotEmpty()
  nama: string;

  @ApiPropertyOptional({ example: 'Meliputi area Grogol dan sekitarnya', description: 'Keterangan tambahan' })
  @IsString()
  @IsOptional()
  keterangan?: string;
}