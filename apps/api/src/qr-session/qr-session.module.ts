import { Module } from '@nestjs/common';
import { QrSessionService } from './qr-session.service';
import { QrSessionController } from './qr-session.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [QrSessionController],
  providers: [QrSessionService],
  exports: [QrSessionService],
})
export class QrSessionModule {}
