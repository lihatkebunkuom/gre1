import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ProdukService } from './produk.service';
import { CreateProdukDto } from './dto/create-produk.dto';
import { UpdateProdukDto } from './dto/update-produk.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Toko Jemaat (Produk)')
@Controller('produk')
export class ProdukController {
  constructor(private readonly produkService: ProdukService) {}

  @Post()
  @ApiOperation({ summary: 'Tambah produk baru' })
  create(@Body() createDto: CreateProdukDto) {
    return this.produkService.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Ambil semua daftar produk' })
  findAll() {
    return this.produkService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Ambil detail produk' })
  findOne(@Param('id') id: string) {
    return this.produkService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update data produk' })
  update(@Param('id') id: string, @Body() updateDto: UpdateProdukDto) {
    return this.produkService.update(id, updateDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Hapus produk dari toko' })
  remove(@Param('id') id: string) {
    return this.produkService.remove(id);
  }
}
