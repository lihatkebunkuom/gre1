import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { BeritaKomselService } from './berita-komsel.service';
import { CreateBeritaKomselDto } from './dto/create-berita-komsel.dto';
import { UpdateBeritaKomselDto } from './dto/update-berita-komsel.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Berita Komsel')
@Controller('berita-komsel')
export class BeritaKomselController {
  constructor(private readonly service: BeritaKomselService) {}

  @Post()
  @ApiOperation({ summary: 'Tambah berita komsel baru' })
  create(@Body() createDto: CreateBeritaKomselDto) {
    return this.service.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Ambil semua berita komsel' })
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Ambil detail berita komsel' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update berita komsel' })
  update(@Param('id') id: string, @Body() updateDto: UpdateBeritaKomselDto) {
    return this.service.update(id, updateDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Hapus berita komsel' })
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
