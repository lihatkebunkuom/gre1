import { IsOptional, IsString, IsNotEmpty, IsDateString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateIbadahPepanthanDto {
  @ApiProperty({ description: 'Judul Ibadah Pepanthan', required: true })
  @IsNotEmpty({ message: 'Judul ibadah wajib diisi' })
  @IsString()
  judul: string;

  @ApiProperty({ description: 'Waktu Mulai Ibadah', required: true })
  @IsNotEmpty({ message: 'Waktu mulai wajib diisi' })
  @IsString()
  waktuMulai: string;

  @ApiPropertyOptional({ description: 'Keterangan Ibadah' })
  @IsOptional()
  @IsString()
  keterangan?: string;

  @ApiProperty({ description: 'Lokasi Ibadah', required: true })
  @IsNotEmpty({ message: 'Lokasi ibadah wajib diisi' })
  @IsString()
  lokasi: string;

  @ApiProperty({ description: 'ID Pepanthan terkait', required: true })
  @IsNotEmpty()
  @IsString()
  pepanthanId: string;

  @ApiPropertyOptional({ description: 'Bahasa Ibadah' })
  @IsOptional()
  @IsString()
  bahasapepanthan?: string;

  @ApiPropertyOptional({ description: 'Tanggal Ibadah' })
  @IsOptional()
  @IsDateString()
  tanggalpepanthan?: string;

  @ApiPropertyOptional({ description: 'Petugas Ibadah' })
  @IsOptional()
  @IsString()
  petugaspepanthan?: string;
}
