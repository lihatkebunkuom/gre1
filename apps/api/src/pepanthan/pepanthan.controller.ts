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
import { PepanthanService } from './pepanthan.service';
import { CreatePepanthanDto } from './dto/create-pepanthan.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Pepanthan')
@Controller('pepanthan')
export class PepanthanController {
  constructor(private readonly pepanthanService: PepanthanService) {}

  @Post()
  @ApiOperation({ summary: 'Tambah Pepanthan Baru' })
  create(@Body() createPepanthanDto: CreatePepanthanDto) {
    return this.pepanthanService.create(createPepanthanDto);
  }

  @Get()
  @ApiOperation({ summary: 'Ambil Semua Data Pepanthan' })
  findAll(@Query('search') search?: string) {
    return this.pepanthanService.findAll(search);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Ambil Detail Pepanthan' })
  findOne(@Param('id') id: string) {
    return this.pepanthanService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update Data Pepanthan' })
  update(@Param('id') id: string, @Body() updatePepanthanDto: Partial<CreatePepanthanDto>) {
    return this.pepanthanService.update(id, updatePepanthanDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Hapus Data Pepanthan' })
  remove(@Param('id') id: string) {
    return this.pepanthanService.remove(id);
  }
}
