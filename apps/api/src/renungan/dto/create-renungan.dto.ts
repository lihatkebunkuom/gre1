import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsDateString,
  IsBoolean,
} from 'class-validator';

export class CreateRenunganDto {
  @ApiProperty({ example: 'Menjaga Hati' })
  @IsString()
  @IsNotEmpty()
  judul: string;

  @ApiProperty({ example: 'Isi renungan hari ini...' })
  @IsString()
  @IsNotEmpty()
  isi: string;

  @ApiProperty({ example: '2026-01-09' })
  @IsDateString()
  @IsNotEmpty()
  tanggal: string;

  @ApiProperty({ example: 'Pdt. John Doe' })
  @IsString()
  @IsNotEmpty()
  penulis: string;

  @ApiPropertyOptional({ example: 'Mazmur 23:1' })
  @IsString()
  @IsOptional()
  ayatAlkitab?: string;

  @ApiPropertyOptional({ example: 'Ringkasan renungan...' })
  @IsString()
  @IsOptional()
  ringkasan?: string;

  @ApiPropertyOptional({ example: 'Umum' })
  @IsString()
  @IsOptional()
  kategori?: string;

  @ApiPropertyOptional({ example: 'https://example.com/image.jpg' })
  @IsString()
  @IsOptional()
  gambarUrl?: string;

  @ApiPropertyOptional({ default: true })
  @IsBoolean()
  @IsOptional()
  ttsStatus?: boolean;

  @ApiPropertyOptional({ default: 'id-ID' })
  @IsString()
  @IsOptional()
  ttsBahasa?: string;

  @ApiPropertyOptional({ default: '1' })
  @IsString()
  @IsOptional()
  ttsKecepatanBaca?: string;

  @ApiPropertyOptional({ default: 'AKTIF' })
  @IsString()
  @IsOptional()
  statusTampil?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  catatan?: string;
}