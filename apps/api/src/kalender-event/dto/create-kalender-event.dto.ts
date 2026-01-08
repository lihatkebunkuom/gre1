import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateKalenderEventDto {
  @ApiProperty({ example: 'Rapat Majelis' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiPropertyOptional({ example: 'Pembahasan program kerja tahunan' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: '2024-01-10T18:00:00Z' })
  @Type(() => Date)
  @IsDate()
  startDate: Date;

  @ApiProperty({ example: '2024-01-10T21:00:00Z' })
  @Type(() => Date)
  @IsDate()
  endDate: Date;

  @ApiPropertyOptional({ example: 'Ruang Rapat 1' })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiPropertyOptional({ example: 'Rapat' })
  @IsOptional()
  @IsString()
  category?: string;
}