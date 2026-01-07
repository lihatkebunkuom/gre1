import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { 
  IsBoolean, IsDateString, IsEmail, IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, IsUUID 
} from 'class-validator';
import { Transform } from 'class-transformer';

enum JenisKelamin { L = 'L', P = 'P' }
enum StatusKeanggotaan { TETAP = 'TETAP', TITIPAN = 'TITIPAN', TAMU = 'TAMU' }
enum StatusPernikahan { BELUM_MENIKAH = 'BELUM_MENIKAH', MENIKAH = 'MENIKAH', CERAI_HIDUP = 'CERAI_HIDUP', CERAI_MATI = 'CERAI_MATI' }
enum StatusSakramen { SUDAH = 'SUDAH', BELUM = 'BELUM' }

export class CreateJemaatDto {
  // A. Data Utama
  @ApiPropertyOptional({ example: 'GM-001', description: 'Nomor Induk Jemaat (Jika kosong akan auto-generate)' })
  @IsString()
  @IsOptional()
  nomorInduk?: string;

  @ApiProperty({ example: 'Andi Pratama' })
  @IsString()
  @IsNotEmpty()
  nama: string;

  @ApiProperty({ enum: JenisKelamin, example: 'L' })
  @IsEnum(JenisKelamin)
  jenisKelamin: JenisKelamin;

  @ApiPropertyOptional({ example: 'Jakarta' })
  @IsString()
  @IsOptional()
  tempatLahir?: string;

  @ApiProperty({ example: '1990-01-01T00:00:00Z' })
  @IsDateString()
  tanggalLahir: string;

  @ApiPropertyOptional({ default: true })
  @IsBoolean()
  @IsOptional()
  statusAktif?: boolean;

  @ApiProperty({ enum: StatusKeanggotaan, default: 'TETAP' })
  @IsEnum(StatusKeanggotaan)
  @IsOptional()
  statusKeanggotaan?: StatusKeanggotaan;

  @ApiPropertyOptional()
  @IsDateString()
  @IsOptional()
  @Transform(({ value }) => value === "" ? undefined : value)
  tanggalBergabung?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  fotoUrl?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  catatanKhusus?: string;

  // B. Kontak
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  noHp?: string;

  @ApiPropertyOptional()
  @IsEmail()
  @IsOptional()
  @Transform(({ value }) => value === "" ? undefined : value)
  email?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  alamat?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  kota?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  provinsi?: string;

  // C. Keluarga
  @ApiProperty({ enum: StatusPernikahan, default: 'BELUM_MENIKAH' })
  @IsEnum(StatusPernikahan)
  @IsOptional()
  statusPernikahan?: StatusPernikahan;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  namaPasangan?: string;

  @ApiPropertyOptional({ default: 0 })
  @IsInt()
  @IsOptional()
  jumlahAnak?: number;

  @ApiPropertyOptional({ default: false })
  @IsBoolean()
  @IsOptional()
  isKepalaKeluarga?: boolean;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  noKK?: string;

  // D. Rohani
  @ApiProperty({ enum: StatusSakramen, default: 'BELUM' })
  @IsEnum(StatusSakramen)
  @IsOptional()
  statusBaptis?: StatusSakramen;

  @ApiPropertyOptional()
  @IsDateString()
  @IsOptional()
  @Transform(({ value }) => value === "" ? undefined : value)
  tanggalBaptis?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  gerejaBaptis?: string;

  @ApiProperty({ enum: StatusSakramen, default: 'BELUM' })
  @IsEnum(StatusSakramen)
  @IsOptional()
  statusSidi?: StatusSakramen;

  @ApiPropertyOptional()
  @IsDateString()
  @IsOptional()
  @Transform(({ value }) => value === "" ? undefined : value)
  tanggalSidi?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  pendetaSidi?: string;

  // E. Pekerjaan
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  pendidikan?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  pekerjaan?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  instansi?: string;

  // F. Pelayanan
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  minatPelayanan?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  pelayananDiikuti?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  peranDalamKelompok?: string;

  // Relasi
  @ApiPropertyOptional()
  @IsUUID()
  @IsOptional()
  @Transform(({ value }) => value === "" ? undefined : value)
  wilayahId?: string;

  @ApiPropertyOptional()
  @IsUUID()
  @IsOptional()
  @Transform(({ value }) => value === "" ? undefined : value)
  kelompokId?: string;
}