import { PartialType } from '@nestjs/swagger';
import { CreateIbadahPepanthanDto } from './create-ibadah-pepanthan.dto';

export class UpdateIbadahPepanthanDto extends PartialType(CreateIbadahPepanthanDto) {}
