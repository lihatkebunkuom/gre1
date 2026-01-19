import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ArtikelRenunganService } from './artikel-renungan.service';
import { CreateArtikelRenunganDto } from './dto/create-artikel-renungan.dto';
import { UpdateArtikelRenunganDto } from './dto/update-artikel-renungan.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Artikel & Renungan')
@Controller('artikel-renungan')
export class ArtikelRenunganController {
  constructor(private readonly service: ArtikelRenunganService) {}

  @Post()
  @ApiOperation({ summary: 'Tambah artikel atau renungan baru' })
  create(@Body() createDto: CreateArtikelRenunganDto) {
    return this.service.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Ambil semua daftar artikel dan renungan' })
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Ambil detail artikel atau renungan' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update artikel atau renungan' })
  update(@Param('id') id: string, @Body() updateDto: UpdateArtikelRenunganDto) {
    return this.service.update(id, updateDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Hapus artikel atau renungan' })
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
