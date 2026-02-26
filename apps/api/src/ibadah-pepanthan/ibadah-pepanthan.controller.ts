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
import { IbadahPepanthanService } from './ibadah-pepanthan.service';
import { CreateIbadahPepanthanDto } from './dto/create-ibadah-pepanthan.dto';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { UpdateIbadahPepanthanDto } from './dto/update-ibadah-pepanthan.dto';

@ApiTags('Ibadah Pepanthan')
@Controller('ibadah-pepanthan')
export class IbadahPepanthanController {
  constructor(private readonly ibadahPepanthanService: IbadahPepanthanService) {}

  @Post()
  @ApiOperation({ summary: 'Tambah Ibadah Pepanthan Baru' })
  create(@Body() createIbadahPepanthanDto: CreateIbadahPepanthanDto) {
    return this.ibadahPepanthanService.create(createIbadahPepanthanDto);
  }

  @Get()
  @ApiOperation({ summary: 'Ambil Semua Data Ibadah Pepanthan' })
  @ApiQuery({ name: 'search', required: false, type: String, description: 'Kata kunci pencarian (opsional)' })
  findAll(@Query('search') search?: string) {
    return this.ibadahPepanthanService.findAll(search);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Ambil Detail Ibadah Pepanthan' })
  findOne(@Param('id') id: string) {
    return this.ibadahPepanthanService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update Data Ibadah Pepanthan' })
  update(@Param('id') id: string, @Body() updateIbadahPepanthanDto: UpdateIbadahPepanthanDto) {
    return this.ibadahPepanthanService.update(id, updateIbadahPepanthanDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Hapus Data Ibadah Pepanthan' })
  remove(@Param('id') id: string) {
    return this.ibadahPepanthanService.remove(id);
  }
}
