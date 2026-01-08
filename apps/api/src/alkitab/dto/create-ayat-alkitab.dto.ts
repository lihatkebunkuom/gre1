import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { 
  IsBoolean, IsInt, IsNotEmpty, IsOptional, IsString, Min 
} from 'class-validator';

export class CreateAyatAlkitabDto {
  @ApiProperty({ example: 'TB' })
  @IsString()
  @IsNotEmpty()
  versiAlkitab: string;

  @ApiProperty({ example: 'Yohanes' })
  @IsString()
  @IsNotEmpty()
  kitab: string;

  @ApiProperty({ example: 3 })
  @IsInt()
  @Min(1)
  pasal: number;

  @ApiProperty({ example: 16 })
  @IsInt()
  @Min(1)
  ayat: number;

  @ApiProperty({ example: 'Karena begitu besar kasih Allah...' })
  @IsString()
  @IsNotEmpty()
  teksAyat: string;

  @ApiPropertyOptional({ default: 'id-ID' })
  @IsString()
  @IsOptional()
  bahasa?: string;

  @ApiPropertyOptional({ example: 'Penguatan' })
  @IsString()
  @IsOptional()
  kategoriAyat?: string;

  @ApiPropertyOptional({ example: 'kasih, keselamatan' })
  @IsString()
  @IsOptional()
  kataKunci?: string;

  @ApiPropertyOptional({ default: true })
  @IsBoolean()
  @IsOptional()
  ttsStatus?: boolean;

  @ApiPropertyOptional({ default: 'id-ID' })
  @IsString()
  @IsOptional()
  ttsBahasa?: string;

  @ApiPropertyOptional({ default: '1' })
  @IsString()
  @IsOptional()
  ttsKecepatanBaca?: string;

  @ApiPropertyOptional({ default: 'AKTIF' })
  @IsString()
  @IsOptional()
  statusTampil?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  catatanAyat?: string;
}
