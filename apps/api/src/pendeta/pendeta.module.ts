import { Module } from '@nestjs/common';
import { PendetaService } from './pendeta.service';
import { PendetaController } from './pendeta.controller';

@Module({
  controllers: [PendetaController],
  providers: [PendetaService],
})
export class PendetaModule {}
