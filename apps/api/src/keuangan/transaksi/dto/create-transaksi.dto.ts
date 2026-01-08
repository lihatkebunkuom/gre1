import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { 
  IsDateString, IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, Min 
} from 'class-validator';

export enum JenisTransaksi {
  PEMASUKAN = 'PEMASUKAN',
  PENGELUARAN = 'PENGELUARAN'
}

export class CreateTransaksiDto {
  @ApiProperty({ enum: JenisTransaksi, example: 'PENGELUARAN' })
  @IsEnum(JenisTransaksi)
  @IsNotEmpty()
  jenisTransaksi: JenisTransaksi;

  @ApiProperty({ example: '2026-01-08T00:00:00Z' })
  @IsDateString()
  @IsNotEmpty()
  tanggalTransaksi: string;

  @ApiProperty({ example: 'Operasional' })
  @IsString()
  @IsNotEmpty()
  kategoriTransaksi: string;

  @ApiProperty({ example: 'Pembayaran Listrik & Air' })
  @IsString()
  @IsNotEmpty()
  deskripsiTransaksi: string;

  @ApiProperty({ example: 2500000 })
  @IsInt()
  @Min(1)
  nominal: number;

  @ApiProperty({ example: 'Transfer' })
  @IsString()
  @IsNotEmpty()
  metodePembayaran: string;

  @ApiProperty({ example: 'PLN & PDAM' })
  @IsString()
  @IsNotEmpty()
  sumberTujuan: string;

  @ApiProperty({ example: 'Bendahara 1' })
  @IsString()
  @IsNotEmpty()
  penanggungJawab: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  buktiTransaksi?: string;

  @ApiPropertyOptional({ default: 'DRAFT' })
  @IsString()
  @IsOptional()
  statusTransaksi?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  catatanTransaksi?: string;
}
