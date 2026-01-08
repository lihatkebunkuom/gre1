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
import { AbsensiKehadiranService } from './absensi-kehadiran.service';
import { CreateAbsensiKehadiranDto } from './dto/create-absensi-kehadiran.dto';
import { UpdateAbsensiKehadiranDto } from './dto/update-absensi-kehadiran.dto';

@ApiTags('Absensi Kehadiran')
@Controller('absensi-kehadiran')
export class AbsensiKehadiranController {
  constructor(
    private readonly absensiKehadiranService: AbsensiKehadiranService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Record new Attendance' })
  @ApiResponse({ status: 201, description: 'Attendance has been successfully recorded.' })
  create(@Body() createAbsensiKehadiranDto: CreateAbsensiKehadiranDto) {
    return this.absensiKehadiranService.create(createAbsensiKehadiranDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all Attendance records' })
  @ApiResponse({ status: 200, description: 'List of all attendance records.' })
  findAll() {
    return this.absensiKehadiranService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get Attendance by ID' })
  @ApiResponse({ status: 200, description: 'The found record.' })
  @ApiResponse({ status: 404, description: 'Record not found.' })
  findOne(@Param('id') id: string) {
    return this.absensiKehadiranService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update Attendance' })
  @ApiResponse({ status: 200, description: 'The record has been successfully updated.' })
  update(
    @Param('id') id: string,
    @Body() updateAbsensiKehadiranDto: UpdateAbsensiKehadiranDto,
  ) {
    return this.absensiKehadiranService.update(id, updateAbsensiKehadiranDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete Attendance' })
  @ApiResponse({ status: 200, description: 'The record has been successfully deleted.' })
  remove(@Param('id') id: string) {
    return this.absensiKehadiranService.remove(id);
  }
}