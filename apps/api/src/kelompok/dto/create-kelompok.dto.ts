import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateKelompokDto {
  @ApiPropertyOptional({ example: 'uuid-kelompok', description: 'ID Kelompok (Optional, untuk menghubungkan ke Kelompok yang sudah ada)' })
  @IsUUID()
  @IsOptional()
  id?: string;

  @ApiProperty({ example: 'Kelompok Sel A', description: 'Nama kelompok' })
  @IsString()
  @IsNotEmpty()
  nama: string;

  @ApiPropertyOptional({ example: 'Kelompok khusus pemuda', description: 'Keterangan lengkap mengenai kelompok' })
  @IsString()
  @IsOptional()
  keteranganKelompok?: string;

  @ApiPropertyOptional({ example: 'uuid-wilayah', description: 'ID Wilayah (Optional)' })
  @IsString()
  @IsOptional()
  wilayahId?: string;
}
