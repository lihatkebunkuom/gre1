import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateKelompokDto {
  @ApiPropertyOptional({ example: 'uuid-kelompok-v4', description: 'ID Kelompok (Optional, untuk menghubungkan ke Kelompok yang sudah ada)' })
  @IsUUID()
  @IsOptional()
  id?: string;

  @ApiProperty({ example: 'Komsel Efrata 1', description: 'Nama kelompok sel' })
  @IsString()
  @IsNotEmpty()
  nama: string;

  @ApiPropertyOptional({ example: 'Bpk. Yohanes', description: 'Nama ketua/gembala kelompok' })
  @IsString()
  @IsOptional()
  ketua?: string;

  @ApiPropertyOptional({ example: 'Jumat, 19:00 WIB', description: 'Jadwal pertemuan rutin' })
  @IsString()
  @IsOptional()
  jadwal?: string;

  @ApiPropertyOptional({ example: 'Fokus pemuridan muda mudi', description: 'Catatan tambahan' })
  @IsString()
  @IsOptional()
  catatan?: string;

  @ApiPropertyOptional({ example: 'uuid-wilayah-v4', description: 'ID Wilayah (Optional)' })
  @IsUUID()
  @IsOptional()
  wilayahId?: string;
}