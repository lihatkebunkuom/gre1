import { Module } from '@nestjs/common';
import { BeritaKomselService } from './berita-komsel.service';
import { BeritaKomselController } from './berita-komsel.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [BeritaKomselController],
  providers: [BeritaKomselService],
})
export class BeritaKomselModule {}
