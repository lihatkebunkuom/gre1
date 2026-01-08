import { Module } from '@nestjs/common';
import { KebaktianMingguService } from './kebaktian-minggu.service';
import { KebaktianMingguController } from './kebaktian-minggu.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [KebaktianMingguController],
  providers: [KebaktianMingguService],
})
export class KebaktianMingguModule {}
