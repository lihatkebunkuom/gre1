import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsDate, IsEnum, IsInt } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateArtikelRenunganDto {
  @ApiProperty({ example: 'Renungan' })
  @IsString()
  jenisKonten: string;

  @ApiProperty({ example: 'Hidup yang Berbuah' })
  @IsString()
  judulKonten: string;

  @ApiPropertyOptional({ example: 'Renungan Harian' })
  @IsString()
  @IsOptional()
  subJudul?: string;

  @ApiPropertyOptional({ example: 'Pdt. Andi Wijaya' })
  @IsString()
  @IsOptional()
  penulis?: string;

  @ApiProperty({ example: '2023-11-20T00:00:00.000Z' })
  @Type(() => Date)
  @IsDate()
  tanggalTerbit: Date;

  @ApiPropertyOptional({ example: 'Iman' })
  @IsString()
  @IsOptional()
  kategoriKonten?: string;

  @ApiPropertyOptional({ example: 'Yohanes 15:5' })
  @IsString()
  @IsOptional()
  ayatAlkitab?: string;

  @ApiPropertyOptional({ example: 'Isi renungan lengkap...' })
  @IsString()
  @IsOptional()
  isiKonten?: string;

  @ApiPropertyOptional({ example: 'Pentingnya tinggal di dalam Kristus.' })
  @IsString()
  @IsOptional()
  ringkasanKonten?: string;

  @ApiPropertyOptional({ example: 'https://example.com/image.jpg' })
  @IsString()
  @IsOptional()
  gambarSampul?: string;

  @ApiProperty({ example: 'Harian', enum: ['Harian', 'Mingguan'] })
  @IsString()
  periode: string;

  @ApiPropertyOptional({ example: 'DRAFT', enum: ['DRAFT', 'TERBIT', 'ARSIP'] })
  @IsString()
  @IsOptional()
  statusPublikasi?: string;

  @ApiPropertyOptional({ example: 'buah, iman, kristus' })
  @IsString()
  @IsOptional()
  tag?: string;

  @ApiPropertyOptional({ example: 0 })
  @IsInt()
  @IsOptional()
  jumlahDibaca?: number;

  @ApiPropertyOptional({ example: '' })
  @IsString()
  @IsOptional()
  catatanEditor?: string;
}
