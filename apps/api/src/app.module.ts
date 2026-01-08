import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { WilayahModule } from './wilayah/wilayah.module';
import { KelompokModule } from './kelompok/kelompok.module';
import { JemaatModule } from './jemaat/jemaat.module';
import { PendetaModule } from './pendeta/pendeta.module';
import { PelayananModule } from './pelayanan/pelayanan.module';
import { QrSessionModule } from './qr-session/qr-session.module';
import { KehadiranModule } from './kehadiran/kehadiran.module';
import { BannerModule } from './banner/banner.module';
import { AlkitabModule } from './alkitab/alkitab.module';
import { DoaModule } from './doa/doa.module';
import { ProdukModule } from './produk/produk.module';
import { KeuanganModule } from './keuangan/keuangan.module';
import { KalenderEventModule } from './kalender-event/kalender-event.module';
import { JadwalIbadahModule } from './jadwal-ibadah/jadwal-ibadah.module';
import { KebaktianMingguModule } from './kebaktian-minggu/kebaktian-minggu.module';
import { AbsensiKehadiranModule } from './absensi-kehadiran/absensi-kehadiran.module';

@Module({
  imports: [
    PrismaModule, 
    WilayahModule, 
    KelompokModule, 
    JemaatModule,
    PendetaModule,
    PelayananModule,
    QrSessionModule,
    KehadiranModule,
    BannerModule,
    AlkitabModule,
    DoaModule,
    ProdukModule,
    KeuanganModule,
    KalenderEventModule,
    JadwalIbadahModule,
    KebaktianMingguModule,
    AbsensiKehadiranModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}