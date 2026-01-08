import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { LaporanKeuanganService } from './laporan.service';
import { CreateLaporanKeuanganDto } from './dto/create-laporan.dto';
import { UpdateLaporanKeuanganDto } from './dto/update-laporan.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Keuangan - Laporan')
@Controller('keuangan/laporan')
export class LaporanKeuanganController {
  constructor(private readonly laporanService: LaporanKeuanganService) {}

  @Post()
  @ApiOperation({ summary: 'Buat laporan keuangan baru' })
  create(@Body() createDto: CreateLaporanKeuanganDto) {
    return this.laporanService.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Ambil semua daftar laporan' })
  findAll() {
    return this.laporanService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Ambil detail laporan' })
  findOne(@Param('id') id: string) {
    return this.laporanService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update data laporan' })
  update(@Param('id') id: string, @Body() updateDto: UpdateLaporanKeuanganDto) {
    return this.laporanService.update(id, updateDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Hapus data laporan' })
  remove(@Param('id') id: string) {
    return this.laporanService.remove(id);
  }
}
