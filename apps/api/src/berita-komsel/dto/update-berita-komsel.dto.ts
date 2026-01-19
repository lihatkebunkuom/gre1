import { PartialType } from '@nestjs/swagger';
import { CreateBeritaKomselDto } from './create-berita-komsel.dto';

export class UpdateBeritaKomselDto extends PartialType(CreateBeritaKomselDto) {}
