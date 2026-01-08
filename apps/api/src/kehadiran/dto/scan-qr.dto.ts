import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class ScanQrDto {
  @ApiProperty({ example: 'ABC123XYZ' })
  @IsString()
  @IsNotEmpty()
  kodeQr: string;

  @ApiProperty({ example: 'uuid-jemaat' })
  @IsUUID()
  @IsNotEmpty()
  jemaatId: string;
}
