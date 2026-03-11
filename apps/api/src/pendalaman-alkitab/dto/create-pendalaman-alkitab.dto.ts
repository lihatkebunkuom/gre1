import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreatePendalamanAlkitabDto {
  @ApiProperty({ example: 'Pendalaman Alkitab Tematik', required: true })
  @IsNotEmpty({ message: 'Judul ibadah wajib diisi' })
  @IsString()
  judul: string;

  @ApiProperty({ example: '18:30', required: true })
  @IsNotEmpty({ message: 'Waktu mulai wajib diisi' })
  @IsString()
  waktuMulai: string;

  @ApiProperty({ example: 'Gedung Pertemuan Lt. 2', required: true })
  @IsNotEmpty({ message: 'Lokasi wajib diisi' })
  @IsString()
  lokasi: string;

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

  @ApiPropertyOptional({ description: 'Bahasa Ibadah' })
  @IsOptional()
  @IsString()
  bahasapa?: string;

  @ApiPropertyOptional({ description: 'Tanggal Ibadah' })
  @IsOptional()
  @IsDateString()
  tanggalpa?: string;

  @ApiPropertyOptional({ description: 'Petugas Ibadah' })
  @IsOptional()
  @IsString()
  petugaspa?: string;
}
