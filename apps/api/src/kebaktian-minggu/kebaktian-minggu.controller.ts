import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { KebaktianMingguService } from './kebaktian-minggu.service';
import { CreateKebaktianMingguDto } from './dto/create-kebaktian-minggu.dto';
import { UpdateKebaktianMingguDto } from './dto/update-kebaktian-minggu.dto';

@ApiTags('Kebaktian Minggu')
@Controller('kebaktian-minggu')
export class KebaktianMingguController {
  constructor(
    private readonly kebaktianMingguService: KebaktianMingguService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create new Kebaktian Minggu' })
  @ApiResponse({ status: 201, description: 'The record has been successfully created.' })
  create(@Body() createKebaktianMingguDto: CreateKebaktianMingguDto) {
    return this.kebaktianMingguService.create(createKebaktianMingguDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all Kebaktian Minggu' })
  @ApiResponse({ status: 200, description: 'List of all records.' })
  findAll() {
    return this.kebaktianMingguService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get Kebaktian Minggu by ID' })
  @ApiResponse({ status: 200, description: 'The found record.' })
  @ApiResponse({ status: 404, description: 'Record not found.' })
  findOne(@Param('id') id: string) {
    return this.kebaktianMingguService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update Kebaktian Minggu' })
  @ApiResponse({ status: 200, description: 'The record has been successfully updated.' })
  update(
    @Param('id') id: string,
    @Body() updateKebaktianMingguDto: UpdateKebaktianMingguDto,
  ) {
    return this.kebaktianMingguService.update(id, updateKebaktianMingguDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete Kebaktian Minggu' })
  @ApiResponse({ status: 200, description: 'The record has been successfully deleted.' })
  remove(@Param('id') id: string) {
    return this.kebaktianMingguService.remove(id);
  }
}