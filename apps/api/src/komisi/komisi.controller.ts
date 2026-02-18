import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { KomisiService } from './komisi.service';
import { CreateKomisiDto } from './dto/create-komisi.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Komisi')
@Controller('komisi')
export class KomisiController {
  constructor(private readonly komisiService: KomisiService) {}

  @Post()
  @ApiOperation({ summary: 'Tambah Komisi Baru' })
  create(@Body() createKomisiDto: CreateKomisiDto) {
    return this.komisiService.create(createKomisiDto);
  }

  @Get()
  @ApiOperation({ summary: 'Ambil Semua Data Komisi' })
  findAll(@Query('search') search?: string) {
    return this.komisiService.findAll(search);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Ambil Detail Komisi' })
  findOne(@Param('id') id: string) {
    return this.komisiService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update Data Komisi' })
  update(@Param('id') id: string, @Body() updateKomisiDto: Partial<CreateKomisiDto>) {
    return this.komisiService.update(id, updateKomisiDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Hapus Data Komisi' })
  remove(@Param('id') id: string) {
    return this.komisiService.remove(id);
  }
}
