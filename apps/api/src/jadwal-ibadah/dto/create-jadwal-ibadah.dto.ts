import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateJadwalIbadahDto {
  @ApiProperty({ example: 'Ibadah Raya Minggu' })
  @IsString()
  @IsNotEmpty()
  namaIbadah: string;

  @ApiProperty({ example: '2024-01-01T09:00:00Z' })
  @Type(() => Date)
  @IsDate()
  tanggal: Date;

  @ApiProperty({ example: '2024-01-01T09:00:00Z' })
  @Type(() => Date)
  @IsDate()
  waktuMulai: Date;

  @ApiProperty({ example: '2024-01-01T11:00:00Z' })
  @Type(() => Date)
  @IsDate()
  waktuSelesai: Date;

  @ApiProperty({ example: 'Gedung Utama' })
  @IsString()
  @IsNotEmpty()
  lokasi: string;

  @ApiProperty({ example: 'Pdt. John Doe' })
  @IsString()
  @IsNotEmpty()
  pembicara: string;

  @ApiPropertyOptional({ example: 'Kasih yang Memulihkan' })
  @IsOptional()
  @IsString()
  tema?: string;

  @ApiPropertyOptional({ example: 'Wajib membawa Alkitab' })
  @IsOptional()
  @IsString()
  keterangan?: string;
}