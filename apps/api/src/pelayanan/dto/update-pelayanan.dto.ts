import { PartialType } from '@nestjs/swagger';
import { CreatePelayananDto } from './create-pelayanan.dto';

export class UpdatePelayananDto extends PartialType(CreatePelayananDto) {}
