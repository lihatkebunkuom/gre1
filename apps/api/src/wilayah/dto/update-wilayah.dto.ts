import { PartialType } from '@nestjs/swagger';
import { CreateWilayahDto } from './create-wilayah.dto';

export class UpdateWilayahDto extends PartialType(CreateWilayahDto) {}
