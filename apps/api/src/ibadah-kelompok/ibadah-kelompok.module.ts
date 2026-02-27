import { Module } from '@nestjs/common';
import { IbadahKelompokService } from './ibadah-kelompok.service';
import { IbadahKelompokController } from './ibadah-kelompok.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [IbadahKelompokController],
  providers: [IbadahKelompokService],
})
export class IbadahKelompokModule {}
