import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { 
  IsBoolean, IsDateString, IsNotEmpty, IsOptional, IsString 
} from 'class-validator';

export class CreatePokokDoaDto {
  @ApiProperty({ example: 'Kesembuhan Ibu Ani' })
  @IsString()
  @IsNotEmpty()
  judulPokokDoa: string;

  @ApiProperty({ example: 'Keluarga' })
  @IsString()
  @IsNotEmpty()
  kategoriDoa: string;

  @ApiProperty({ example: 'Mohon dukungan doa untuk Ibu Ani...' })
  @IsString()
  @IsNotEmpty()
  deskripsiDoa: string;

  @ApiProperty({ example: 'Jemaat' })
  @IsString()
  @IsNotEmpty()
  pengajuDoa: string;

  @ApiProperty({ example: '2026-01-08T00:00:00Z' })
  @IsDateString()
  @IsNotEmpty()
  tanggalPengajuan: string;

  @ApiPropertyOptional({ default: 'Sedang' })
  @IsString()
  @IsOptional()
  tingkatPrioritas?: string;

  @ApiPropertyOptional({ default: 'AKTIF' })
  @IsString()
  @IsOptional()
  statusDoa?: string;

  @ApiPropertyOptional()
  @IsDateString()
  @IsOptional()
  tanggalTerjawab?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  kesaksianJawabanDoa?: string;

  @ApiPropertyOptional({ default: true })
  @IsBoolean()
  @IsOptional()
  ttsStatus?: boolean;

  @ApiPropertyOptional({ default: 'id-ID' })
  @IsString()
  @IsOptional()
  ttsBahasa?: string;

  @ApiPropertyOptional({ default: '1' })
  @IsString()
  @IsOptional()
  ttsKecepatanBaca?: string;

  @ApiPropertyOptional({ default: 'PUBLIK' })
  @IsString()
  @IsOptional()
  statusTampil?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  catatanDoa?: string;
}
