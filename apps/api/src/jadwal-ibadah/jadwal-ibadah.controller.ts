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
import { JadwalIbadahService } from './jadwal-ibadah.service';
import { CreateJadwalIbadahDto } from './dto/create-jadwal-ibadah.dto';
import { UpdateJadwalIbadahDto } from './dto/update-jadwal-ibadah.dto';

@ApiTags('Jadwal Ibadah')
@Controller('jadwal-ibadah')
export class JadwalIbadahController {
  constructor(private readonly jadwalIbadahService: JadwalIbadahService) {}

  @Post()
  @ApiOperation({ summary: 'Create new Jadwal Ibadah' })
  @ApiResponse({ status: 201, description: 'The record has been successfully created.' })
  create(@Body() createJadwalIbadahDto: CreateJadwalIbadahDto) {
    return this.jadwalIbadahService.create(createJadwalIbadahDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all Jadwal Ibadah' })
  @ApiResponse({ status: 200, description: 'List of all Jadwal Ibadah.' })
  findAll() {
    return this.jadwalIbadahService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get Jadwal Ibadah by ID' })
  @ApiResponse({ status: 200, description: 'The found record.' })
  @ApiResponse({ status: 404, description: 'Record not found.' })
  findOne(@Param('id') id: string) {
    return this.jadwalIbadahService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update Jadwal Ibadah' })
  @ApiResponse({ status: 200, description: 'The record has been successfully updated.' })
  update(
    @Param('id') id: string,
    @Body() updateJadwalIbadahDto: UpdateJadwalIbadahDto,
  ) {
    return this.jadwalIbadahService.update(id, updateJadwalIbadahDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete Jadwal Ibadah' })
  @ApiResponse({ status: 200, description: 'The record has been successfully deleted.' })
  remove(@Param('id') id: string) {
    return this.jadwalIbadahService.remove(id);
  }
}