import { PartialType } from '@nestjs/swagger';
import { CreatePendetaDto } from './create-pendeta.dto';

export class UpdatePendetaDto extends PartialType(CreatePendetaDto) {}
