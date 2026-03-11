import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpsertTentangGerejaDto {
  @ApiProperty({ description: 'Sejarah Gereja', example: 'Gereja didirikan pada tahun...' })
  @IsNotEmpty()
  @IsString()
  sejarah: string;

  @ApiProperty({ description: 'Visi dan Misi Gereja', example: 'Visi: Menjadi berkat...' })
  @IsNotEmpty()
  @IsString()
  visiMisi: string;

  @ApiProperty({ description: 'Susunan dan Bidang Majelis', example: 'Ketua: Pdt. X...' })
  @IsNotEmpty()
  @IsString()
  susunanMajelis: string;

  @ApiProperty({ description: 'Susunan Pengurus Komisi', example: 'Komisi Pemuda: ...' })
  @IsNotEmpty()
  @IsString()
  susunanPengurusKomisi: string;
}
