import { PartialType } from '@nestjs/swagger';
import { CreateIbadahKelompokDto } from './create-ibadah-kelompok.dto';

export class UpdateIbadahKelompokDto extends PartialType(CreateIbadahKelompokDto) {}
