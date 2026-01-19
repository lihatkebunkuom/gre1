import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { MediaGaleriService } from './media-galeri.service';
import { CreateMediaGaleriDto } from './dto/create-media-galeri.dto';
import { UpdateMediaGaleriDto } from './dto/update-media-galeri.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Media & Galeri')
@Controller('media-galeri')
export class MediaGaleriController {
  constructor(private readonly service: MediaGaleriService) {}

  @Post()
  @ApiOperation({ summary: 'Tambah media baru' })
  create(@Body() createDto: CreateMediaGaleriDto) {
    return this.service.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Ambil semua media' })
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Ambil detail media' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update media' })
  update(@Param('id') id: string, @Body() updateDto: UpdateMediaGaleriDto) {
    return this.service.update(id, updateDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Hapus media' })
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
