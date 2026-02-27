import { Module } from '@nestjs/common';
import { IbadahWilayahService } from './ibadah-wilayah.service';
import { IbadahWilayahController } from './ibadah-wilayah.controller';

@Module({
  controllers: [IbadahWilayahController],
  providers: [IbadahWilayahService],
})
export class IbadahWilayahModule {}
