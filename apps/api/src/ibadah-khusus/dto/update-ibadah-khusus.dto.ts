import { PartialType } from '@nestjs/swagger';
import { CreateIbadahKhususDto } from './create-ibadah-khusus.dto';

export class UpdateIbadahKhususDto extends PartialType(CreateIbadahKhususDto) {}
