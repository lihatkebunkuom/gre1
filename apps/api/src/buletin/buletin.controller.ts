import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { BuletinService } from './buletin.service';
import { CreateBuletinDto } from './dto/create-buletin.dto';
import { UpdateBuletinDto } from './dto/update-buletin.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Buletin GKJ')
@Controller('buletin')
export class BuletinController {
  constructor(private readonly service: BuletinService) {}

  @Post()
  @ApiOperation({ summary: 'Tambah buletin baru' })
  create(@Body() createDto: CreateBuletinDto) {
    return this.service.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Ambil semua buletin' })
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Ambil detail buletin' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update buletin' })
  update(@Param('id') id: string, @Body() updateDto: UpdateBuletinDto) {
    return this.service.update(id, updateDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Hapus buletin' })
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
