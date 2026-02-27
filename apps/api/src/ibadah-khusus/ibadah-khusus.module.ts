import { Module } from '@nestjs/common';
import { IbadahKhususService } from './ibadah-khusus.service';
import { IbadahKhususController } from './ibadah-khusus.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [IbadahKhususController],
  providers: [IbadahKhususService],
})
export class IbadahKhususModule {}
