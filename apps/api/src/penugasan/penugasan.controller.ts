import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PenugasanService } from './penugasan.service';
import { CreatePenugasanDto } from './dto/create-penugasan.dto';
import { UpdatePenugasanDto } from './dto/update-penugasan.dto';
import { Penugasan } from './entities/penugasan.entity';

@ApiTags('Penugasan')
@Controller('penugasan')
export class PenugasanController {
  constructor(private readonly penugasanService: PenugasanService) {}

  @Post()
  @ApiOperation({ summary: 'Create new assignment' })
  @ApiResponse({ status: 201, description: 'The record has been successfully created.', type: Penugasan })
  create(@Body() createDto: CreatePenugasanDto) {
    return this.penugasanService.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'List all assignments' })
  @ApiResponse({ status: 200, type: [Penugasan] })
  findAll() {
    return this.penugasanService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get assignment details' })
  @ApiResponse({ status: 200, type: Penugasan })
  findOne(@Param('id') id: string) {
    return this.penugasanService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update assignment' })
  @ApiResponse({ status: 200, type: Penugasan })
  update(@Param('id') id: string, @Body() updateDto: UpdatePenugasanDto) {
    return this.penugasanService.update(id, updateDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete assignment' })
  @ApiResponse({ status: 200 })
  remove(@Param('id') id: string) {
    return this.penugasanService.remove(id);
  }
}
