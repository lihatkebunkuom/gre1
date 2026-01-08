import { PartialType } from '@nestjs/swagger';
import { CreateAbsensiKehadiranDto } from './create-absensi-kehadiran.dto';

export class UpdateAbsensiKehadiranDto extends PartialType(CreateAbsensiKehadiranDto) {}