import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { DoaService } from './doa.service';
import { CreatePokokDoaDto } from './dto/create-pokok-doa.dto';
import { UpdatePokokDoaDto } from './dto/update-pokok-doa.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Pokok Doa')
@Controller('doa')
export class DoaController {
  constructor(private readonly doaService: DoaService) {}

  @Post()
  @ApiOperation({ summary: 'Tambah pokok doa baru' })
  create(@Body() createDto: CreatePokokDoaDto) {
    return this.doaService.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Ambil semua daftar pokok doa' })
  findAll() {
    return this.doaService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Ambil detail pokok doa' })
  findOne(@Param('id') id: string) {
    return this.doaService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update pokok doa' })
  update(@Param('id') id: string, @Body() updateDto: UpdatePokokDoaDto) {
    return this.doaService.update(id, updateDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Hapus pokok doa' })
  remove(@Param('id') id: string) {
    return this.doaService.remove(id);
  }
}
