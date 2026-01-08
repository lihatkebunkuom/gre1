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
import { BannerService } from './banner.service';
import { CreateBannerDto, BannerPosition } from './dto/create-banner.dto';
import { UpdateBannerDto } from './dto/update-banner.dto';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';

@ApiTags('Banner')
@Controller('banners')
export class BannerController {
  constructor(private readonly bannerService: BannerService) {}

  @Post()
  @ApiOperation({ summary: 'Tambah banner baru' })
  create(@Body() createBannerDto: CreateBannerDto) {
    return this.bannerService.create(createBannerDto);
  }

  @Get()
  @ApiOperation({ summary: 'Ambil semua banner' })
  @ApiQuery({ name: 'position', enum: BannerPosition, required: false })
  findAll(@Query('position') position?: BannerPosition) {
    return this.bannerService.findAll(position);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Ambil detail banner' })
  findOne(@Param('id') id: string) {
    return this.bannerService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update banner' })
  update(@Param('id') id: string, @Body() updateBannerDto: UpdateBannerDto) {
    return this.bannerService.update(id, updateBannerDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Hapus banner' })
  remove(@Param('id') id: string) {
    return this.bannerService.remove(id);
  }
}
