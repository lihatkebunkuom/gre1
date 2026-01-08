import { Module } from '@nestjs/common';
import { KalenderEventService } from './kalender-event.service';
import { KalenderEventController } from './kalender-event.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [KalenderEventController],
  providers: [KalenderEventService],
})
export class KalenderEventModule {}
