import { PartialType } from '@nestjs/swagger';
import { CreateKelompokDto } from './create-kelompok.dto';

export class UpdateKelompokDto extends PartialType(CreateKelompokDto) {}
