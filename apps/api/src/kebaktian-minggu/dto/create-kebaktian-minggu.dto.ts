import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateKebaktianMingguDto {
  @ApiProperty({ example: '2024-01-07T00:00:00Z' })
  @Type(() => Date)
  @IsDate()
  tanggal: Date;

  @ApiProperty({ example: '2024-01-07T09:00:00Z' })
  @Type(() => Date)
  @IsDate()
  waktu: Date;

  @ApiProperty({ example: 'Hidup yang Berbuah' })
  @IsString()
  @IsNotEmpty()
  tema: string;

  @ApiProperty({ example: 'Pdt. Jane Doe' })
  @IsString()
  @IsNotEmpty()
  pengkhotbah: string;

  @ApiProperty({ example: 'Dkn. John Smith' })
  @IsString()
  @IsNotEmpty()
  liturgos: string;

  @ApiPropertyOptional({ example: 'Ibu Sarah' })
  @IsOptional()
  @IsString()
  pembacaWarta?: string;

  @ApiPropertyOptional({ example: 'Persiapan perjamuan kudus' })
  @IsOptional()
  @IsString()
  catatan?: string;
}