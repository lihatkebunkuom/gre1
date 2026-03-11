import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateIbadahKhususDto {
  @ApiProperty({ example: 'Ibadah Syukuran Gedung Baru', required: true })
  @IsNotEmpty({ message: 'Judul ibadah wajib diisi' })
  @IsString()
  judul: string;

  @ApiProperty({ example: '10:00', required: true })
  @IsNotEmpty({ message: 'Waktu mulai wajib diisi' })
  @IsString()
  waktuMulai: string;

  @ApiProperty({ example: 'Aula Serbaguna GKJ', required: true })
  @IsNotEmpty({ message: 'Lokasi wajib diisi' })
  @IsString()
  lokasi: string;

  @ApiPropertyOptional({ example: 'Ibadah syukur atas selesainya pembangunan' })
  @IsString()
  @IsOptional()
  keterangan?: string;

  @ApiPropertyOptional({ description: 'Bahasa Ibadah' })
  @IsOptional()
  @IsString()
  bahasakhusus?: string;

  @ApiPropertyOptional({ description: 'Tanggal Ibadah' })
  @IsOptional()
  @IsDateString()
  tanggalkhusus?: string;

  @ApiPropertyOptional({ description: 'Petugas Ibadah' })
  @IsOptional()
  @IsString()
  petugaskhusus?: string;
}
