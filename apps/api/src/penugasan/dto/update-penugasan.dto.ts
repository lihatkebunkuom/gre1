import { PartialType } from '@nestjs/swagger';
import { CreatePenugasanDto } from './create-penugasan.dto';

export class UpdatePenugasanDto extends PartialType(CreatePenugasanDto) {}
