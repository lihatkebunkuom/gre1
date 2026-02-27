import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsOptional, IsString } from 'class-validator';

export class CreateIbadahKhususDto {
  @ApiPropertyOptional({ example: 'Ibadah Syukuran Gedung Baru' })
  @IsString()
  @IsOptional()
  judul?: string;

  @ApiPropertyOptional({ example: '2026-04-15T10:00:00Z' })
  @IsDateString()
  @IsOptional()
  waktu?: string;

  @ApiPropertyOptional({ example: 'Aula Serbaguna GKJ' })
  @IsString()
  @IsOptional()
  lokasi?: string;

  @ApiPropertyOptional({ example: 'Ibadah syukur atas selesainya pembangunan' })
  @IsString()
  @IsOptional()
  keterangan?: string;
}
