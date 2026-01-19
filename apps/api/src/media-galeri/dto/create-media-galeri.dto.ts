import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsDate, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateMediaGaleriDto {
  @ApiProperty({ example: 'Video' })
  @IsString()
  jenisMedia: string;

  @ApiProperty({ example: 'Highlight Natal 2023' })
  @IsString()
  judulMedia: string;

  @ApiPropertyOptional({ example: 'Dokumentasi perayaan Natal.' })
  @IsString()
  @IsOptional()
  deskripsiMedia?: string;

  @ApiProperty({ example: 'Event' })
  @IsString()
  kategoriMedia: string;

  @ApiPropertyOptional({ example: 'https://youtube.com/watch?v=xyz' })
  @IsString()
  @IsOptional()
  fileMedia?: string;

  @ApiPropertyOptional({ example: 'https://example.com/thumb.jpg' })
  @IsString()
  @IsOptional()
  thumbnailMedia?: string;

  @ApiProperty({ example: '2023-12-26T00:00:00.000Z' })
  @Type(() => Date)
  @IsDate()
  tanggalUpload: Date;

  @ApiPropertyOptional({ example: '05:30' })
  @IsString()
  @IsOptional()
  durasiMedia?: string;

  @ApiProperty({ example: 'Tim Multimedia' })
  @IsString()
  pengunggah: string;

  @ApiPropertyOptional({ example: 'DITAMPILKAN' })
  @IsString()
  @IsOptional()
  statusTampil?: string;

  @ApiPropertyOptional({ example: 'natal, dokumentasi' })
  @IsString()
  @IsOptional()
  tagMedia?: string;

  @ApiPropertyOptional({ example: '' })
  @IsString()
  @IsOptional()
  catatanMedia?: string;
}
