import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { 
  IsBoolean, IsDateString, IsEnum, IsNotEmpty, IsOptional, IsString, IsUrl 
} from 'class-validator';

export enum BannerPosition {
  TOP = 'TOP',
  MIDDLE = 'MIDDLE',
  BOTTOM = 'BOTTOM'
}

export class CreateBannerDto {
  @ApiPropertyOptional({ example: 'Ibadah Raya Spesial Natal' })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiProperty({ example: 'https://images.unsplash.com/photo-1512389142860-9c449e58a543' })
  @IsString()
  @IsNotEmpty()
  imageUrl: string;

  @ApiPropertyOptional({ example: 'Event' })
  @IsString()
  @IsOptional()
  kategori?: string;

  @ApiPropertyOptional({ example: '2026-01-08' })
  @IsDateString()
  @IsOptional()
  tanggal?: string;

  @ApiProperty({ enum: BannerPosition, example: 'TOP' })
  @IsEnum(BannerPosition)
  @IsNotEmpty()
  position: BannerPosition;

  @ApiPropertyOptional({ default: true })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
