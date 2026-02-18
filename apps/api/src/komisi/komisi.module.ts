import { Module } from '@nestjs/common';
import { KomisiService } from './komisi.service';
import { KomisiController } from './komisi.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [KomisiController],
  providers: [KomisiService],
})
export class KomisiModule {}
