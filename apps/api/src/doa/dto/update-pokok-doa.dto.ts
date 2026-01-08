import { PartialType } from '@nestjs/swagger';
import { CreatePokokDoaDto } from './create-pokok-doa.dto';

export class UpdatePokokDoaDto extends PartialType(CreatePokokDoaDto) {}
