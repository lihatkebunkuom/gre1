import { Module } from '@nestjs/common';
import { IbadahUmumService } from './ibadah-umum.service';
import { IbadahUmumController } from './ibadah-umum.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [IbadahUmumController],
  providers: [IbadahUmumService],
})
export class IbadahUmumModule {}
