import { Module } from '@nestjs/common';
import { PelayananService } from './pelayanan.service';
import { PelayananController } from './pelayanan.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [PelayananController],
  providers: [PelayananService],
})
export class PelayananModule {}
