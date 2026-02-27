import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { IbadahKhususService } from './ibadah-khusus.service';
import { CreateIbadahKhususDto } from './dto/create-ibadah-khusus.dto';
import { UpdateIbadahKhususDto } from './dto/update-ibadah-khusus.dto';

@ApiTags('Ibadah Khusus')
@Controller('ibadah-khusus')
export class IbadahKhususController {
  constructor(private readonly ibadahKhususService: IbadahKhususService) {}

  @Post()
  @ApiOperation({ summary: 'Tambah data ibadah khusus baru' })
  @ApiResponse({ status: 201, description: 'Data ibadah khusus berhasil disimpan.' })
  create(@Body() createDto: CreateIbadahKhususDto) {
    return this.ibadahKhususService.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Ambil daftar ibadah khusus' })
  findAll() {
    return this.ibadahKhususService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Ambil detail ibadah khusus berdasarkan ID' })
  findOne(@Param('id') id: string) {
    return this.ibadahKhususService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update data ibadah khusus' })
  update(@Param('id') id: string, @Body() updateDto: UpdateIbadahKhususDto) {
    return this.ibadahKhususService.update(id, updateDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Hapus data ibadah khusus' })
  remove(@Param('id') id: string) {
    return this.ibadahKhususService.remove(id);
  }
}
