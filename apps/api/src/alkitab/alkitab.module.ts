import { Module } from '@nestjs/common';
import { AlkitabService } from './alkitab.service';
import { AlkitabController } from './alkitab.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [AlkitabController],
  providers: [AlkitabService],
})
export class AlkitabModule {}
