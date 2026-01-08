import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { TransaksiService } from './transaksi/transaksi.service';
import { TransaksiController } from './transaksi/transaksi.controller';
import { PersembahanService } from './persembahan/persembahan.service';
import { PersembahanController } from './persembahan/persembahan.controller';
import { LaporanKeuanganService } from './laporan/laporan.service';
import { LaporanKeuanganController } from './laporan/laporan.controller';

@Module({
  imports: [PrismaModule],
  controllers: [
    TransaksiController,
    PersembahanController,
    LaporanKeuanganController,
  ],
  providers: [
    TransaksiService,
    PersembahanService,
    LaporanKeuanganService,
  ],
})
export class KeuanganModule {}
