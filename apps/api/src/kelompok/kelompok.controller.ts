import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { KelompokService } from './kelompok.service';
import { CreateKelompokDto } from './dto/create-kelompok.dto';
import { UpdateKelompokDto } from './dto/update-kelompok.dto';

@ApiTags('Kelompok')
@Controller('kelompok')
export class KelompokController {
  constructor(private readonly kelompokService: KelompokService) {}

  @Post()
  @ApiOperation({ summary: 'Tambah kelompok baru' })
  @ApiResponse({ status: 201, description: 'Kelompok berhasil dibuat.' })
  create(@Body() createKelompokDto: CreateKelompokDto) {
    return this.kelompokService.create(createKelompokDto);
  }

  @Get()
  @ApiOperation({ summary: 'Ambil semua data kelompok' })
  findAll() {
    return this.kelompokService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Ambil detail kelompok berdasarkan ID' })
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
