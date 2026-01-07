import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { KelompokService } from './kelompok.service';
import { CreateKelompokDto } from './dto/create-kelompok.dto';
import { UpdateKelompokDto } from './dto/update-kelompok.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Kelompok')
@Controller('kelompok')
export class KelompokController {
  constructor(private readonly kelompokService: KelompokService) {}

  @Post()
  @ApiOperation({ summary: 'Tambah kelompok/komsel baru' })
  create(@Body() createKelompokDto: CreateKelompokDto) {
    return this.kelompokService.create(createKelompokDto);
  }

  @Get()
  @ApiOperation({ summary: 'Ambil semua data kelompok' })
  findAll() {
    return this.kelompokService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Ambil detail kelompok' })
  findOne(@Param('id') id: string) {
    return this.kelompokService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update data kelompok' })
  update(@Param('id') id: string, @Body() updateKelompokDto: UpdateKelompokDto) {
    return this.kelompokService.update(id, updateKelompokDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Hapus kelompok' })
  remove(@Param('id') id: string) {
    return this.kelompokService.remove(id);
  }
}