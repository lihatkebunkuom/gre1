import { PartialType } from '@nestjs/swagger';
import { CreateKebaktianMingguDto } from './create-kebaktian-minggu.dto';

export class UpdateKebaktianMingguDto extends PartialType(CreateKebaktianMingguDto) {}