import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { AlkitabService } from './alkitab.service';
import { CreateAyatAlkitabDto } from './dto/create-ayat-alkitab.dto';
import { UpdateAyatAlkitabDto } from './dto/update-ayat-alkitab.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Alkitab Digital')
@Controller('alkitab')
export class AlkitabController {
  constructor(private readonly alkitabService: AlkitabService) {}

  @Post()
  @ApiOperation({ summary: 'Tambah ayat Alkitab harian' })
  create(@Body() createDto: CreateAyatAlkitabDto) {
    return this.alkitabService.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Ambil semua daftar ayat' })
  findAll() {
    return this.alkitabService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Ambil detail ayat' })
  findOne(@Param('id') id: string) {
    return this.alkitabService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update ayat Alkitab' })
  update(@Param('id') id: string, @Body() updateDto: UpdateAyatAlkitabDto) {
    return this.alkitabService.update(id, updateDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Hapus ayat Alkitab' })
  remove(@Param('id') id: string) {
    return this.alkitabService.remove(id);
  }
}
