import { PartialType } from '@nestjs/swagger';
import { CreateQrSessionDto } from './create-qr-session.dto';

export class UpdateQrSessionDto extends PartialType(CreateQrSessionDto) {}
