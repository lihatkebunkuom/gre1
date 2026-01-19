import { Module } from '@nestjs/common';
import { MediaGaleriService } from './media-galeri.service';
import { MediaGaleriController } from './media-galeri.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [MediaGaleriController],
  providers: [MediaGaleriService],
})
export class MediaGaleriModule {}
