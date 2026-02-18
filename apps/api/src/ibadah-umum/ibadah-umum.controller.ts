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
import { IbadahUmumService } from './ibadah-umum.service';
import { CreateIbadahUmumDto } from './dto/create-ibadah-umum.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Ibadah Umum')
@Controller('ibadah-umum')
export class IbadahUmumController {
  constructor(private readonly ibadahUmumService: IbadahUmumService) {}

  @Post()
  @ApiOperation({ summary: 'Tambah Ibadah Umum Baru' })
  create(@Body() createIbadahUmumDto: CreateIbadahUmumDto) {
    return this.ibadahUmumService.create(createIbadahUmumDto);
  }

  @Get()
  @ApiOperation({ summary: 'Ambil Semua Data Ibadah Umum' })
  findAll(@Query('search') search?: string) {
    return this.ibadahUmumService.findAll(search);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Ambil Detail Ibadah Umum' })
  findOne(@Param('id') id: string) {
    return this.ibadahUmumService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update Data Ibadah Umum' })
  update(@Param('id') id: string, @Body() updateIbadahUmumDto: Partial<CreateIbadahUmumDto>) {
    return this.ibadahUmumService.update(id, updateIbadahUmumDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Hapus Data Ibadah Umum' })
  remove(@Param('id') id: string) {
    return this.ibadahUmumService.remove(id);
  }
}
