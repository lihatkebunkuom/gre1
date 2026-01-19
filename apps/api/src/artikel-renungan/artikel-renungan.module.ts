import { Module } from '@nestjs/common';
import { ArtikelRenunganService } from './artikel-renungan.service';
import { ArtikelRenunganController } from './artikel-renungan.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ArtikelRenunganController],
  providers: [ArtikelRenunganService],
})
export class ArtikelRenunganModule {}
