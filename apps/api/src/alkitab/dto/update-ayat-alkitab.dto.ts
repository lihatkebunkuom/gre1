import { PartialType } from '@nestjs/swagger';
import { CreateAyatAlkitabDto } from './create-ayat-alkitab.dto';

export class UpdateAyatAlkitabDto extends PartialType(CreateAyatAlkitabDto) {}
