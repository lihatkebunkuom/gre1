import { Module } from '@nestjs/common';
import { RenunganService } from './renungan.service';
import { RenunganController } from './renungan.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [RenunganController],
  providers: [RenunganService],
})
export class RenunganModule {}