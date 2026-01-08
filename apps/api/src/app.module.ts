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

@Module({
  imports: [
    PrismaModule, 
    WilayahModule, 
    KelompokModule, 
    JemaatModule,
    PendetaModule,
    PelayananModule,
    QrSessionModule,
    KehadiranModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}