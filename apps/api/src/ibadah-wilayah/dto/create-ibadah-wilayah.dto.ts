import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsDateString } from 'class-validator';

export class CreateIbadahWilayahDto {
  @ApiProperty({ example: 'Ibadah Keluarga', description: 'Judul Ibadah' })
  @IsString()
  @IsNotEmpty()
  judul: string;

  @ApiProperty({ example: '2026-03-01T19:00:00Z', description: 'Waktu pelaksanaan (ISO DateTime)' })
  @IsDateString()
  @IsNotEmpty()
  waktu: string;

  @ApiPropertyOptional({ example: 'Rumah Bp. Yohanes', description: 'Lokasi ibadah' })
  @IsString()
  @IsOptional()
  lokasi?: string;

  @ApiPropertyOptional({ example: 'Membawa Alkitab', description: 'Keterangan tambahan' })
  @IsString()
  @IsOptional()
  keterangan?: string;

  @ApiProperty({ example: 'uuid-wilayah', description: 'ID Wilayah terkait' })
  @IsString()
  @IsNotEmpty()
  wilayahId: string;
}
