import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { TransaksiService } from './transaksi.service';
import { CreateTransaksiDto } from './dto/create-transaksi.dto';
import { UpdateTransaksiDto } from './dto/update-transaksi.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Keuangan - Transaksi')
@Controller('keuangan/transaksi')
export class TransaksiController {
  constructor(private readonly transaksiService: TransaksiService) {}

  @Post()
  @ApiOperation({ summary: 'Catat transaksi baru' })
  create(@Body() createDto: CreateTransaksiDto) {
    return this.transaksiService.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Ambil semua daftar transaksi' })
  findAll() {
    return this.transaksiService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Ambil detail transaksi' })
  findOne(@Param('id') id: string) {
    return this.transaksiService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update data transaksi' })
  update(@Param('id') id: string, @Body() updateDto: UpdateTransaksiDto) {
    return this.transaksiService.update(id, updateDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Hapus data transaksi' })
  remove(@Param('id') id: string) {
    return this.transaksiService.remove(id);
  }
}
