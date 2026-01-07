import { Module } from '@nestjs/common';
import { KelompokService } from './kelompok.service';
import { KelompokController } from './kelompok.controller';

@Module({
  controllers: [KelompokController],
  providers: [KelompokService],
})
export class KelompokModule {}
