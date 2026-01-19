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

  @ApiProperty({ example: 'Pdt. Andi Wijaya' })
  @IsString()
  penulis: string;

  @ApiProperty({ example: '2023-11-20T00:00:00.000Z' })
  @Type(() => Date)
  @IsDate()
  tanggalTerbit: Date;

  @ApiProperty({ example: 'Iman' })
  @IsString()
  kategoriKonten: string;

  @ApiPropertyOptional({ example: 'Yohanes 15:5' })
  @IsString()
  @IsOptional()
  ayatAlkitab?: string;

  @ApiProperty({ example: 'Isi renungan lengkap...' })
  @IsString()
  isiKonten: string;

  @ApiProperty({ example: 'Pentingnya tinggal di dalam Kristus.' })
  @IsString()
  ringkasanKonten: string;

  @ApiPropertyOptional({ example: 'https://example.com/image.jpg' })
  @IsString()
  @IsOptional()
  gambarSampul?: string;

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
