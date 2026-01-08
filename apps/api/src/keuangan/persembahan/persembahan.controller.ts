import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { PersembahanService } from './persembahan.service';
import { CreatePersembahanDto } from './dto/create-persembahan.dto';
import { UpdatePersembahanDto } from './dto/update-persembahan.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Keuangan - Persembahan')
@Controller('keuangan/persembahan')
export class PersembahanController {
  constructor(private readonly persembahanService: PersembahanService) {}

  @Post()
  @ApiOperation({ summary: 'Input persembahan baru' })
  create(@Body() createDto: CreatePersembahanDto) {
    return this.persembahanService.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Ambil semua daftar persembahan' })
  findAll() {
    return this.persembahanService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Ambil detail persembahan' })
  findOne(@Param('id') id: string) {
    return this.persembahanService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update data persembahan' })
  update(@Param('id') id: string, @Body() updateDto: UpdatePersembahanDto) {
    return this.persembahanService.update(id, updateDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Hapus data persembahan' })
  remove(@Param('id') id: string) {
    return this.persembahanService.remove(id);
  }
}
