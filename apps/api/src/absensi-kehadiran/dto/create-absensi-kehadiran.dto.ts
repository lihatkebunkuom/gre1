import { ApiProperty } from '@nestjs/swagger';
import { MetodeKehadiran } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsDate, IsEnum, IsNotEmpty, IsUUID } from 'class-validator';

export class CreateAbsensiKehadiranDto {
  @ApiProperty({ example: 'uuid-jadwal-ibadah' })
  @IsUUID()
  @IsNotEmpty()
  jadwalIbadahId: string;

  @ApiProperty({ example: 'uuid-jemaat' })
  @IsUUID()
  @IsNotEmpty()
  jemaatId: string;

  @ApiProperty({ example: '2024-01-07T09:15:00Z' })
  @Type(() => Date)
  @IsDate()
  waktuHadir: Date;

  @ApiProperty({ enum: MetodeKehadiran, example: MetodeKehadiran.QR_CODE })
  @IsEnum(MetodeKehadiran)
  @IsNotEmpty()
  metode: MetodeKehadiran;
}