import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateKomisiDto {
  @ApiProperty({ description: 'Nama Komisi' })
  @IsNotEmpty()
  @IsString()
  namaKomisi: string;

  @ApiProperty({ description: 'Keterangan Komisi', required: false })
  @IsOptional()
  @IsString()
  keterangan?: string;
}
