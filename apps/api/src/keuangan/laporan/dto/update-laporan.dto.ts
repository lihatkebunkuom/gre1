import { PartialType } from '@nestjs/swagger';
import { CreateLaporanKeuanganDto } from './create-laporan.dto';

export class UpdateLaporanKeuanganDto extends PartialType(CreateLaporanKeuanganDto) {}
