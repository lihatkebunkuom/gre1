import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePepanthanDto {
  @ApiProperty({ description: 'Nama Pepanthan' })
  @IsNotEmpty()
  @IsString()
  namaPepanthan: string;

  @ApiProperty({ description: 'Alamat Pepanthan', required: false })
  @IsOptional()
  @IsString()
  alamat?: string;

  @ApiProperty({ description: 'Keterangan Pepanthan', required: false })
  @IsOptional()
  @IsString()
  keterangan?: string;
}
