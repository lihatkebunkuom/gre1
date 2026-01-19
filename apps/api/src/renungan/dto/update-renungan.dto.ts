import { PartialType } from '@nestjs/swagger';
import { CreateRenunganDto } from './create-renungan.dto';

export class UpdateRenunganDto extends PartialType(CreateRenunganDto) {}