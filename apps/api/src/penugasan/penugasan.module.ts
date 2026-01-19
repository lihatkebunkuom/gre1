import { Module } from '@nestjs/common';
import { PenugasanService } from './penugasan.service';
import { PenugasanController } from './penugasan.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [PenugasanController],
  providers: [PenugasanService],
})
export class PenugasanModule {}
