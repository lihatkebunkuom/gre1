import { PartialType } from '@nestjs/swagger';
import { CreateMediaGaleriDto } from './create-media-galeri.dto';

export class UpdateMediaGaleriDto extends PartialType(CreateMediaGaleriDto) {}
