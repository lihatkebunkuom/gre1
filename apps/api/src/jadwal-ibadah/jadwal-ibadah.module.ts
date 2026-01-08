import { Module } from '@nestjs/common';
import { JadwalIbadahService } from './jadwal-ibadah.service';
import { JadwalIbadahController } from './jadwal-ibadah.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [JadwalIbadahController],
  providers: [JadwalIbadahService],
})
export class JadwalIbadahModule {}
