import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean, IsDateString, IsEmail, IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, IsUUID,
  ValidateNested,
} from 'class-validator';
import { CreateKelompokDto } from '../../kelompok/dto/create-kelompok.dto';
import { CreateWilayahDto } from '../../wilayah/dto/create-wilayah.dto';
import { CreateJemaatDto } from './create-jemaat.dto';

// Enum definitions (copied from CreateJemaatDto to ensure they are available)
enum JenisKelamin { L = 'L', P = 'P' }
enum StatusKeanggotaan { TETAP = 'TETAP', TITIPAN = 'TITIPAN', TAMU = 'TAMU' }
enum StatusPernikahan { BELUM_MENIKAH = 'BELUM_MENIKAH', MENIKAH = 'MENIKAH', CERAI_HIDUP = 'CERAI_HIDUP', CERAI_MATI = 'CERAI_MATI' }
enum StatusSakramen { SUDAH = 'SUDAH', BELUM = 'BELUM' }

export class CreateJemaatWithRelationsDto extends CreateJemaatDto {
  @ApiPropertyOptional({ type: () => CreateWilayahDto, description: 'Data untuk membuat Wilayah baru atau menghubungkan ke yang sudah ada' })
  @IsOptional()
  @ValidateNested()
  @Type(() => CreateWilayahDto)
  wilayah?: CreateWilayahDto;

  @ApiPropertyOptional({ type: () => CreateKelompokDto, description: 'Data untuk membuat Kelompok baru atau menghubungkan ke yang sudah ada' })
  @IsOptional()
  @ValidateNested()
  @Type(() => CreateKelompokDto)
  kelompok?: CreateKelompokDto;
}
