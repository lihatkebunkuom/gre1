import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { 
  IsDateString, IsInt, IsNotEmpty, IsOptional, IsString, Min 
} from 'class-validator';

export class CreatePersembahanDto {
  @ApiProperty({ example: 'Persembahan Mingguan' })
  @IsString()
  @IsNotEmpty()
  jenisPersembahan: string;

  @ApiProperty({ example: '2026-01-08T00:00:00Z' })
  @IsDateString()
  @IsNotEmpty()
  tanggalPersembahan: string;

  @ApiProperty({ example: 'Ibadah Raya 1' })
  @IsString()
  @IsNotEmpty()
  ibadahKegiatan: string;

  @ApiProperty({ example: 1500000 })
  @IsInt()
  @Min(1)
  nominal: number;

  @ApiProperty({ example: 'Tunai' })
  @IsString()
  @IsNotEmpty()
  metodePemberian: string;

  @ApiPropertyOptional({ default: 'Anonim' })
  @IsString()
  @IsOptional()
  namaPemberi?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  kategoriJemaat?: string;

  @ApiProperty({ example: 'Kas Umum' })
  @IsString()
  @IsNotEmpty()
  tujuanPersembahan: string;

  @ApiPropertyOptional({ default: 'TERCATAT' })
  @IsString()
  @IsOptional()
  statusPencatatan?: string;

  @ApiProperty({ example: 'Tim Perhitungan' })
  @IsString()
  @IsNotEmpty()
  petugasPencatat: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  catatanPersembahan?: string;
}
