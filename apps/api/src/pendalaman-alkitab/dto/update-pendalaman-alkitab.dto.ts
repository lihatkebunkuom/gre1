import { PartialType } from '@nestjs/swagger';
import { CreatePendalamanAlkitabDto } from './create-pendalaman-alkitab.dto';

export class UpdatePendalamanAlkitabDto extends PartialType(CreatePendalamanAlkitabDto) {}
