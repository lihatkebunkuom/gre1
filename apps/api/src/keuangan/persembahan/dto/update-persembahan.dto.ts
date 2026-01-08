import { PartialType } from '@nestjs/swagger';
import { CreatePersembahanDto } from './create-persembahan.dto';

export class UpdatePersembahanDto extends PartialType(CreatePersembahanDto) {}
