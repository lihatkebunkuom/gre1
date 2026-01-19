import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsDate, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateBeritaKomselDto {
  @ApiProperty({ example: 'Kunjungan Kasih Wilayah A' })
  @IsString()
  title: string;

  @ApiProperty({ example: '2023-11-20T00:00:00.000Z' })
  @Type(() => Date)
  @IsDate()
  tanggal: Date;

  @ApiProperty({ example: 'Komsel Wilayah A akan mengadakan kunjungan kasih ke panti asuhan.' })
  @IsString()
  deskripsi: string;

  @ApiPropertyOptional({ example: 'https://example.com/image.jpg' })
  @IsString()
  @IsOptional()
  imageUrl?: string;
}
