import { PartialType } from '@nestjs/swagger';
import { CreateKalenderEventDto } from './create-kalender-event.dto';

export class UpdateKalenderEventDto extends PartialType(CreateKalenderEventDto) {}