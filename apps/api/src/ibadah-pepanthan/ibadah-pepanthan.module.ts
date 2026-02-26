import { Module } from '@nestjs/common';
import { IbadahPepanthanService } from './ibadah-pepanthan.service';
import { IbadahPepanthanController } from './ibadah-pepanthan.controller';

@Module({
  controllers: [IbadahPepanthanController],
  providers: [IbadahPepanthanService],
})
export class IbadahPepanthanModule {}
