import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreatePelayananDto {
  @ApiProperty({ example: 'Tim Musik & Pujian' })
  @IsNotEmpty()
  @IsString()
  nama_pelayanan: string;

  @ApiProperty({ example: 'Musik' })
  @IsNotEmpty()
  @IsString()
  kategori_pelayanan: string;

  @ApiPropertyOptional({ example: 'Melayani musik di ibadah raya' })
  @IsOptional()
  @IsString()
  deskripsi_pelayanan?: string;

  @ApiProperty({ example: 'Sdr. David' })
  @IsNotEmpty()
  @IsString()
  koordinator_pelayanan: string;

  @ApiProperty({ example: 10 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  jumlah_kebutuhan_personel?: number;

  @ApiPropertyOptional({ example: 'AKTIF' })
  @IsOptional()
  @IsString()
  status_pelayanan?: string;

  @ApiPropertyOptional({ example: 'Setiap Minggu' })
  @IsOptional()
  @IsString()
  jadwal_pelayanan?: string;

  @ApiPropertyOptional({ example: 'Catatan tambahan' })
  @IsOptional()
  @IsString()
  catatan_pelayanan?: string;
}