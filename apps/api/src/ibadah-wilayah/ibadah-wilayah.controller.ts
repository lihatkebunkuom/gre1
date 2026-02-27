import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { IbadahWilayahService } from './ibadah-wilayah.service';
import { CreateIbadahWilayahDto } from './dto/create-ibadah-wilayah.dto';
import { UpdateIbadahWilayahDto } from './dto/update-ibadah-wilayah.dto';

@ApiTags('Ibadah Wilayah')
@Controller('ibadah-wilayah')
export class IbadahWilayahController {
  constructor(private readonly ibadahWilayahService: IbadahWilayahService) {}

  @Post()
  @ApiOperation({ summary: 'Tambah jadwal ibadah wilayah baru' })
  @ApiResponse({ status: 201, description: 'Jadwal ibadah wilayah berhasil dibuat.' })
  create(@Body() createIbadahWilayahDto: CreateIbadahWilayahDto) {
    return this.ibadahWilayahService.create(createIbadahWilayahDto);
  }

  @Get()
  @ApiOperation({ summary: 'Ambil semua jadwal ibadah wilayah' })
  findAll() {
    return this.ibadahWilayahService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Ambil detail jadwal ibadah wilayah berdasarkan ID' })
  findOne(@Param('id') id: string) {
    return this.ibadahWilayahService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update jadwal ibadah wilayah' })
  update(@Param('id') id: string, @Body() updateIbadahWilayahDto: UpdateIbadahWilayahDto) {
    return this.ibadahWilayahService.update(id, updateIbadahWilayahDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Hapus jadwal ibadah wilayah' })
  remove(@Param('id') id: string) {
    return this.ibadahWilayahService.remove(id);
  }
}
