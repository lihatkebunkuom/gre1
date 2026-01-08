import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { 
  IsBoolean, IsDateString, IsEmail, IsEnum, IsInt, IsOptional, IsString, Min 
} from 'class-validator';
import { JenisKelamin, JabatanPendeta, StatusPernikahan } from '@prisma/client';

export class CreatePendetaDto {
  @ApiProperty()
  @IsString()
  namaLengkap: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  gelar?: string;

  @ApiProperty({ enum: JenisKelamin })
  @IsEnum(JenisKelamin)
  jenisKelamin: JenisKelamin;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  tempatLahir?: string;

  @ApiProperty()
  @IsDateString()
  tanggalLahir: Date;

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  statusAktif?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  fotoPendeta?: string;

  @ApiProperty()
  @IsString()
  noHandphone: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  alamat?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  kota?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  provinsi?: string;

  @ApiProperty({ enum: JabatanPendeta })
  @IsEnum(JabatanPendeta)
  jabatanPelayanan: JabatanPendeta;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  tanggalPenahbisan?: Date;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  wilayahPelayanan?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  bidangPelayanan?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  jadwalPelayanan?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  nomorIndukPendeta?: string;

  @ApiPropertyOptional({ enum: StatusPernikahan, default: StatusPernikahan.BELUM_MENIKAH })
  @IsOptional()
  @IsEnum(StatusPernikahan)
  statusPernikahan?: StatusPernikahan;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  namaPasangan?: string;

  @ApiPropertyOptional({ default: 0 })
  @IsOptional()
  @IsInt()
  @Min(0)
  jumlahAnak?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  pendidikanTerakhir?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  institusiTeologi?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  tahunLulus?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  riwayatPendidikan?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  biografiSingkat?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  igLink?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  fbLink?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  ytLink?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  catatanInternal?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  riwayatPelayananText?: string;
}
