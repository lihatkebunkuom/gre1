import { Module } from '@nestjs/common';
import { PepanthanService } from './pepanthan.service';
import { PepanthanController } from './pepanthan.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [PepanthanController],
  providers: [PepanthanService],
})
export class PepanthanModule {}
