import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { 
  IsBoolean, IsDateString, IsNotEmpty, IsOptional, IsString 
} from 'class-validator';

export class CreateQrSessionDto {
  @ApiProperty({ example: 'Ibadah Minggu' })
  @IsString()
  @IsNotEmpty()
  namaKegiatan: string;

  @ApiProperty({ example: 'Ibadah Raya' })
  @IsString()
  @IsNotEmpty()
  jenisKegiatan: string;

  @ApiProperty({ example: '2026-01-11' })
  @IsDateString()
  @IsNotEmpty()
  tanggalKegiatan: string;

  @ApiProperty({ example: '2026-01-11T08:00:00Z' })
  @IsDateString()
  @IsNotEmpty()
  waktuMulai: string;

  @ApiProperty({ example: '2026-01-11T11:00:00Z' })
  @IsDateString()
  @IsNotEmpty()
  waktuSelesai: string;

  @ApiPropertyOptional({ default: true })
  @IsBoolean()
  @IsOptional()
  statusAktif?: boolean;
}
