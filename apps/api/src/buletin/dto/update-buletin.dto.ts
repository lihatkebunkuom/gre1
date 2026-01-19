import { PartialType } from '@nestjs/swagger';
import { CreateBuletinDto } from './create-buletin.dto';

export class UpdateBuletinDto extends PartialType(CreateBuletinDto) {}
