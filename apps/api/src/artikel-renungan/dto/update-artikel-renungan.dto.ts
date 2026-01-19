import { PartialType } from '@nestjs/swagger';
import { CreateArtikelRenunganDto } from './create-artikel-renungan.dto';

export class UpdateArtikelRenunganDto extends PartialType(CreateArtikelRenunganDto) {}
