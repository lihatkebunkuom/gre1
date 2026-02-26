import { IsOptional, IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateIbadahPepanthanDto {
  @ApiProperty({ description: 'Judul Ibadah Pepanthan', required: false })
  @IsOptional()
  @IsString()
  judul?: string;

  @ApiProperty({ description: 'Waktu Mulai Ibadah', required: false })
  @IsOptional()
  @IsString()
  waktuMulai?: string;

  @ApiProperty({ description: 'Keterangan Ibadah', required: false })
  @IsOptional()
  @IsString()
  keterangan?: string;

  @ApiProperty({ description: 'Lokasi Ibadah', required: false })
  @IsOptional()
  @IsString()
  lokasi?: string;

  @ApiProperty({ description: 'ID Pepanthan terkait', required: true })
  @IsNotEmpty()
  @IsString()
  pepanthanId: string;
}
