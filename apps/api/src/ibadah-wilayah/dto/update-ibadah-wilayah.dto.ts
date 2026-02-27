import { PartialType } from '@nestjs/swagger';
import { CreateIbadahWilayahDto } from './create-ibadah-wilayah.dto';

export class UpdateIbadahWilayahDto extends PartialType(CreateIbadahWilayahDto) {}
