import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateIbadahKelompokDto {
  @ApiPropertyOptional({ example: 'Ibadah Rumah Tangga Kelompok A' })
  @IsString()
  @IsOptional()
  judul?: string;

  @ApiPropertyOptional({ example: '2026-03-10T19:00:00Z' })
  @IsDateString()
  @IsOptional()
  waktu?: string;

  @ApiPropertyOptional({ example: 'Rumah Kel. Bapak Budi' })
  @IsString()
  @IsOptional()
  lokasi?: string;

  @ApiPropertyOptional({ example: 'Membahas tentang kerukunan' })
  @IsString()
  @IsOptional()
  keterangan?: string;

  @ApiProperty({ example: 'uuid-kelompok-id' })
  @IsUUID()
  @IsNotEmpty()
  kelompokId: string;
}
