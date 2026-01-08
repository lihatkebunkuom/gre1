import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { PelayananService } from './pelayanan.service';
import { CreatePelayananDto } from './dto/create-pelayanan.dto';
import { UpdatePelayananDto } from './dto/update-pelayanan.dto';

@ApiTags('Pelayanan')
@Controller('pelayanan')
export class PelayananController {
  constructor(private readonly pelayananService: PelayananService) {}

  @Post()
  @ApiOperation({ summary: 'Tambah unit pelayanan baru' })
  create(@Body() createPelayananDto: CreatePelayananDto) {
    return this.pelayananService.create(createPelayananDto);
  }

  @Get()
  @ApiOperation({ summary: 'Daftar semua unit pelayanan' })
  @ApiQuery({ name: 'search', required: false })
  findAll(@Query('search') search?: string) {
    return this.pelayananService.findAll(search);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Detail unit pelayanan' })
  findOne(@Param('id') id: string) {
    return this.pelayananService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update data unit pelayanan' })
  update(@Param('id') id: string, @Body() updatePelayananDto: UpdatePelayananDto) {
    return this.pelayananService.update(id, updatePelayananDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Hapus unit pelayanan' })
  remove(@Param('id') id: string) {
    return this.pelayananService.remove(id);
  }
}