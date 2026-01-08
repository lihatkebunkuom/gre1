import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { 
  IsArray, IsInt, IsNotEmpty, IsOptional, IsString, Max, Min 
} from 'class-validator';

export class CreateProdukDto {
  @ApiProperty({ example: "Kaos Rohani 'Blessed'" })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 85000 })
  @IsInt()
  @Min(0)
  harga: number;

  @ApiPropertyOptional({ example: 5, default: 5 })
  @IsInt()
  @Min(1)
  @Max(5)
  @IsOptional()
  rating?: number;

  @ApiProperty({ example: "Bahan Cotton Combed 30s..." })
  @IsString()
  @IsNotEmpty()
  deskripsi: string;

  @ApiPropertyOptional({ example: ["https://example.com/image.jpg"], default: [] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  images?: string[];
}
