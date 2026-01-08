import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { 
  IsDateString, IsInt, IsNotEmpty, IsOptional, IsString 
} from 'class-validator';

export class CreateLaporanKeuanganDto {
  @ApiProperty({ example: 'Bulanan' })
  @IsString()
  @IsNotEmpty()
  jenisLaporan: string;

  @ApiProperty({ example: '2026-01-01T00:00:00Z' })
  @IsDateString()
  @IsNotEmpty()
  tanggalMulai: string;

  @ApiProperty({ example: '2026-01-31T00:00:00Z' })
  @IsDateString()
  @IsNotEmpty()
  tanggalSelesai: string;

  @ApiProperty({ example: 50000000 })
  @IsInt()
  totalPemasukan: number;

  @ApiProperty({ example: 35000000 })
  @IsInt()
  totalPengeluaran: number;

  @ApiProperty({ example: 10000000 })
  @IsInt()
  saldoAwal: number;

  @ApiProperty({ example: 25000000 })
  @IsInt()
  saldoAkhir: number;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  ringkasanLaporan?: string;

  @ApiProperty({ example: 'Bendahara' })
  @IsString()
  @IsNotEmpty()
  disusunOleh: string;

  @ApiPropertyOptional({ default: 'DRAFT' })
  @IsString()
  @IsOptional()
  statusLaporan?: string;
}
