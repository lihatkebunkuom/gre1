import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { RenunganService } from './renungan.service';
import { CreateRenunganDto } from './dto/create-renungan.dto';
import { UpdateRenunganDto } from './dto/update-renungan.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Renungan')
@Controller('renungan')
export class RenunganController {
  constructor(private readonly renunganService: RenunganService) {}

  @Post()
  @ApiOperation({ summary: 'Tambah renungan baru' })
  create(@Body() createDto: CreateRenunganDto) {
    return this.renunganService.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Ambil semua daftar renungan' })
  findAll() {
    return this.renunganService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Ambil detail renungan' })
  findOne(@Param('id') id: string) {
    return this.renunganService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update renungan' })
  update(@Param('id') id: string, @Body() updateDto: UpdateRenunganDto) {
    return this.renunganService.update(id, updateDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Hapus renungan' })
  remove(@Param('id') id: string) {
    return this.renunganService.remove(id);
  }
}