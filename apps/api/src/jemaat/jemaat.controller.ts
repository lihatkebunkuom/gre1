import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { JemaatService } from './jemaat.service';
import { CreateJemaatDto } from './dto/create-jemaat.dto';
import { UpdateJemaatDto } from './dto/update-jemaat.dto';
import { CreateJemaatWithRelationsDto } from './dto/create-jemaat-with-relations.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';

@ApiTags('Jemaat')
@Controller('jemaat')
export class JemaatController {
  constructor(private readonly jemaatService: JemaatService) {}

  @Post()
  @ApiOperation({ summary: 'Tambah data jemaat baru (tanpa relasi Wilayah/Kelompok)' })
  @ApiResponse({ status: 201, description: 'Data jemaat berhasil disimpan.' })
  create(@Body() createJemaatDto: CreateJemaatDto) {
    return this.jemaatService.create(createJemaatDto);
  }

  @Post('with-relations')
  @ApiOperation({ summary: 'Tambah data jemaat baru beserta Wilayah dan Kelompok terkait' })
  @ApiResponse({ status: 201, description: 'Data jemaat beserta relasi berhasil disimpan.' })
  createWithRelations(@Body() createJemaatWithRelationsDto: CreateJemaatWithRelationsDto) {
    return this.jemaatService.createJemaatWithRelations(createJemaatWithRelationsDto);
  }

  @Get()
  @ApiOperation({ summary: 'Ambil daftar jemaat (Support Search)' })
  @ApiQuery({ name: 'search', required: false, description: 'Cari nama atau no induk' })
  findAll(@Query('search') search?: string) {
    return this.jemaatService.findAll(search);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Ambil detail jemaat berdasarkan ID' })
  findOne(@Param('id') id: string) {
    return this.jemaatService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update data jemaat' })
  update(@Param('id') id: string, @Body() updateJemaatDto: UpdateJemaatDto) {
    return this.jemaatService.update(id, updateJemaatDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Hapus data jemaat' })
  remove(@Param('id') id: string) {
    return this.jemaatService.remove(id);
  }
}