import { Module } from '@nestjs/common';
import { AbsensiKehadiranService } from './absensi-kehadiran.service';
import { AbsensiKehadiranController } from './absensi-kehadiran.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [AbsensiKehadiranController],
  providers: [AbsensiKehadiranService],
})
export class AbsensiKehadiranModule {}
