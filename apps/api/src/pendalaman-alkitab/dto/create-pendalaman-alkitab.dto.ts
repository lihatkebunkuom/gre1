import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreatePendalamanAlkitabDto {
  @ApiPropertyOptional({ example: 'Pendalaman Alkitab Tematik' })
  @IsString()
  @IsOptional()
  judul?: string;

  @ApiPropertyOptional({ example: '2026-05-20T18:30:00Z' })
  @IsDateString()
  @IsOptional()
  waktu?: string;

  @ApiPropertyOptional({ example: 'Gedung Pertemuan Lt. 2' })
  @IsString()
  @IsOptional()
  lokasi?: string;

  @ApiPropertyOptional({ example: 'Membahas tentang Surat-surat Paulus' })
  @IsString()
  @IsOptional()
  keterangan?: string;

  @ApiPropertyOptional()
  @IsUUID()
  @IsOptional()
  pepanthanId?: string;

  @ApiPropertyOptional()
  @IsUUID()
  @IsOptional()
  wilayahId?: string;

  @ApiPropertyOptional()
  @IsUUID()
  @IsOptional()
  kelompokId?: string;

  @ApiPropertyOptional()
  @IsUUID()
  @IsOptional()
  komisiId?: string;
}
