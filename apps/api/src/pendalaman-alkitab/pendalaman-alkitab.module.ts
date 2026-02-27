import { Module } from '@nestjs/common';
import { PendalamanAlkitabService } from './pendalaman-alkitab.service';
import { PendalamanAlkitabController } from './pendalaman-alkitab.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [PendalamanAlkitabController],
  providers: [PendalamanAlkitabService],
})
export class PendalamanAlkitabModule {}
