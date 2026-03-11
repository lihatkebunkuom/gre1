import { Module } from '@nestjs/common';
import { TentangGerejaService } from './tentang-gereja.service';
import { TentangGerejaController } from './tentang-gereja.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [TentangGerejaController],
  providers: [TentangGerejaService],
})
export class TentangGerejaModule {}
