import { Module } from '@nestjs/common';
import { BuletinService } from './buletin.service';
import { BuletinController } from './buletin.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [BuletinController],
  providers: [BuletinService],
})
export class BuletinModule {}
