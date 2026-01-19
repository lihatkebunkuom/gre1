import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsDate, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateBuletinDto {
  @ApiProperty({ example: 'Warta Jemaat - Edisi November' })
  @IsString()
  title: string;

  @ApiProperty({ example: '2023-11-05T00:00:00.000Z' })
  @Type(() => Date)
  @IsDate()
  tanggal: Date;

  @ApiProperty({ example: 'Ringkasan kegiatan gereja bulan November minggu pertama.' })
  @IsString()
  deskripsi: string;

  @ApiPropertyOptional({ example: 'https://example.com/buletin.pdf' })
  @IsString()
  @IsOptional()
  fileUrl?: string;
}
