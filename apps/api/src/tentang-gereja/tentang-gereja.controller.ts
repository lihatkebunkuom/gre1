import { Controller, Get, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { TentangGerejaService } from './tentang-gereja.service';
import { UpsertTentangGerejaDto } from './dto/upsert-tentang-gereja.dto';

@ApiTags('Tentang Gereja')
@Controller('tentang-gereja')
export class TentangGerejaController {
  constructor(private readonly service: TentangGerejaService) {}

  @Get()
  @ApiOperation({ summary: 'Mengambil data informasi Tentang Gereja' })
  getData() {
    return this.service.getData();
  }

  @Post()
  @ApiOperation({ summary: 'Memperbarui atau membuat data informasi Tentang Gereja' })
  upsert(@Body() dto: UpsertTentangGerejaDto) {
    return this.service.upsertData(dto);
  }
}
