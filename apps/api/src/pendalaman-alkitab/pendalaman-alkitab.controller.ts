import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PendalamanAlkitabService } from './pendalaman-alkitab.service';
import { CreatePendalamanAlkitabDto } from './dto/create-pendalaman-alkitab.dto';
import { UpdatePendalamanAlkitabDto } from './dto/update-pendalaman-alkitab.dto';

@ApiTags('Pendalaman Alkitab')
@Controller('pendalaman-alkitab')
export class PendalamanAlkitabController {
  constructor(private readonly service: PendalamanAlkitabService) {}

  @Post()
  @ApiOperation({ summary: 'Tambah data pendalaman alkitab baru' })
  @ApiResponse({ status: 201, description: 'Data pendalaman alkitab berhasil disimpan.' })
  create(@Body() createDto: CreatePendalamanAlkitabDto) {
    return this.service.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Ambil daftar pendalaman alkitab' })
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Ambil detail pendalaman alkitab berdasarkan ID' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update data pendalaman alkitab' })
  update(@Param('id') id: string, @Body() updateDto: UpdatePendalamanAlkitabDto) {
    return this.service.update(id, updateDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Hapus data pendalaman alkitab' })
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
