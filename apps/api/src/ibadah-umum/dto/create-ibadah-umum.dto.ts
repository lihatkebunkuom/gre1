import { IsOptional, IsString, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateIbadahUmumDto {
  @ApiProperty({ description: 'Judul Ibadah', required: false })
  @IsOptional()
  @IsString()
  judul?: string;

  @ApiProperty({ description: 'Waktu Mulai Ibadah', required: false })
  @IsOptional()
  @IsString()
  waktuMulai?: string;

  @ApiProperty({ description: 'Keterangan Ibadah', required: false })
  @IsOptional()
  @IsString()
  keterangan?: string;

  @ApiProperty({ description: 'Lokasi Ibadah', required: false })
  @IsOptional()
  @IsString()
  lokasi?: string;
}
