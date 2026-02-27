import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { IbadahKelompokService } from './ibadah-kelompok.service';
import { CreateIbadahKelompokDto } from './dto/create-ibadah-kelompok.dto';
import { UpdateIbadahKelompokDto } from './dto/update-ibadah-kelompok.dto';

@ApiTags('Ibadah Kelompok')
@Controller('ibadah-kelompok')
export class IbadahKelompokController {
  constructor(private readonly ibadahKelompokService: IbadahKelompokService) {}

  @Post()
  @ApiOperation({ summary: 'Tambah data ibadah kelompok baru' })
  @ApiResponse({ status: 201, description: 'Data ibadah kelompok berhasil disimpan.' })
  create(@Body() createDto: CreateIbadahKelompokDto) {
    return this.ibadahKelompokService.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Ambil daftar ibadah kelompok' })
  findAll() {
    return this.ibadahKelompokService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Ambil detail ibadah kelompok berdasarkan ID' })
  findOne(@Param('id') id: string) {
    return this.ibadahKelompokService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update data ibadah kelompok' })
  update(@Param('id') id: string, @Body() updateDto: UpdateIbadahKelompokDto) {
    return this.ibadahKelompokService.update(id, updateDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Hapus data ibadah kelompok' })
  remove(@Param('id') id: string) {
    return this.ibadahKelompokService.remove(id);
  }
}
