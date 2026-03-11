import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsDate, IsOptional, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateMediaGaleriDto {
  @ApiProperty({ example: 'Video' })
  @IsString()
  @IsNotEmpty()
  jenisMedia: string;

  @ApiPropertyOptional({ example: 'Highlight Natal 2023' })
  @IsString()
  @IsOptional()
  judulMedia?: string;

  @ApiPropertyOptional({ example: 'Dokumentasi perayaan Natal.' })
  @IsString()
  @IsOptional()
  deskripsiMedia?: string;

  @ApiProperty({ example: 'IBADAH', enum: ['IBADAH', 'EVENT', 'PELAYANAN', 'LAINNYA'] })
  @IsString()
  @IsNotEmpty()
  kategoriMedia: string;

  @ApiPropertyOptional({ example: 'https://youtube.com/watch?v=xyz' })
  @IsString()
  @IsOptional()
  fileMedia?: string;

  @ApiProperty({ example: 'https://example.com/thumb.jpg' })
  @IsString()
  @IsNotEmpty({ message: 'Thumbnail wajib diisi' })
  thumbnailMedia: string;

  @ApiProperty({ example: '2023-12-26T00:00:00.000Z' })
  @Type(() => Date)
  @IsDate()
  tanggalUpload: Date;

  @ApiPropertyOptional({ example: '05:30' })
  @IsString()
  @IsOptional()
  durasiMedia?: string;

  @ApiPropertyOptional({ example: 'Tim Multimedia' })
  @IsString()
  @IsOptional()
  pengunggah?: string;

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
