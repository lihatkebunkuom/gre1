import { Module } from '@nestjs/common';
import { KehadiranService } from './kehadiran.service';
import { KehadiranController } from './kehadiran.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { QrSessionModule } from '../qr-session/qr-session.module';

@Module({
  imports: [PrismaModule, QrSessionModule],
  controllers: [KehadiranController],
  providers: [KehadiranService],
})
export class KehadiranModule {}
