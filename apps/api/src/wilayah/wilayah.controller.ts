import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { WilayahService } from './wilayah.service';
import { CreateWilayahDto } from './dto/create-wilayah.dto';
import { UpdateWilayahDto } from './dto/update-wilayah.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Wilayah')
@Controller('wilayah')
export class WilayahController {
  constructor(private readonly wilayahService: WilayahService) {}

  @Post()
  @ApiOperation({ summary: 'Tambah wilayah baru' })
  @ApiResponse({ status: 201, description: 'Wilayah berhasil dibuat.' })
  create(@Body() createWilayahDto: CreateWilayahDto) {
    return this.wilayahService.create(createWilayahDto);
  }

  @Get()
  @ApiOperation({ summary: 'Ambil semua data wilayah' })
  findAll() {
    return this.wilayahService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Ambil detail wilayah berdasarkan ID' })
  findOne(@Param('id') id: string) {
    return this.wilayahService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update data wilayah' })
  update(@Param('id') id: string, @Body() updateWilayahDto: UpdateWilayahDto) {
    return this.wilayahService.update(id, updateWilayahDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Hapus wilayah' })
  remove(@Param('id') id: string) {
    return this.wilayahService.remove(id);
  }
}