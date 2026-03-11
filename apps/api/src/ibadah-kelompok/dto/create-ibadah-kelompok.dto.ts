import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateIbadahKelompokDto {
  @ApiProperty({ example: 'Ibadah Rumah Tangga Kelompok A', required: true })
  @IsNotEmpty({ message: 'Judul ibadah wajib diisi' })
  @IsString()
  judul: string;

  @ApiProperty({ example: '19:00', required: true })
  @IsNotEmpty({ message: 'Waktu mulai wajib diisi' })
  @IsString()
  waktuMulai: string;

  @ApiProperty({ example: 'Rumah Kel. Bapak Budi', required: true })
  @IsNotEmpty({ message: 'Lokasi wajib diisi' })
  @IsString()
  lokasi: string;

  @ApiPropertyOptional({ example: 'Membahas tentang kerukunan' })
  @IsString()
  @IsOptional()
  keterangan?: string;

  @ApiProperty({ example: 'uuid-kelompok-id', required: true })
  @IsUUID()
  @IsNotEmpty()
  kelompokId: string;

  @ApiPropertyOptional({ description: 'Bahasa Ibadah' })
  @IsOptional()
  @IsString()
  bahasakelompok?: string;

  @ApiPropertyOptional({ description: 'Tanggal Ibadah' })
  @IsOptional()
  @IsDateString()
  tanggalkelompok?: string;

  @ApiPropertyOptional({ description: 'Petugas Ibadah' })
  @IsOptional()
  @IsString()
  petugaskelompok?: string;
}
