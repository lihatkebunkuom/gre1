import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsDateString } from 'class-validator';

export class CreatePenugasanDto {
  @ApiProperty({ example: 'uuid-pelayanan' })
  @IsNotEmpty()
  @IsString()
  pelayanan_id: string;

  @ApiProperty({ example: 'uuid-petugas' })
  @IsNotEmpty()
  @IsString()
  petugas_id: string;

  @ApiProperty({ example: 'Pemain Gitar' })
  @IsNotEmpty()
  @IsString()
  peran_dalam_pelayanan: string;

  @ApiProperty({ example: '2023-01-01' })
  @IsNotEmpty()
  @IsDateString()
  tanggal_mulai_penugasan: string;

  @ApiPropertyOptional({ example: '2023-12-31' })
  @IsOptional()
  @IsDateString()
  tanggal_selesai_penugasan?: string;

  @ApiPropertyOptional({ example: 'Minggu Ganjil' })
  @IsOptional()
  @IsString()
  jadwal_tugas?: string;

  @ApiPropertyOptional({ example: 'AKTIF' })
  @IsOptional()
  @IsString()
  status_penugasan?: string;

  @ApiPropertyOptional({ example: 'Baik' })
  @IsOptional()
  @IsString()
  evaluasi_kinerja?: string;

  @ApiPropertyOptional({ example: 'Catatan...' })
  @IsOptional()
  @IsString()
  catatan_penugasan?: string;
}
