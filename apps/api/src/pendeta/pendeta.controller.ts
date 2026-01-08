import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PendetaService } from './pendeta.service';
import { CreatePendetaDto } from './dto/create-pendeta.dto';
import { UpdatePendetaDto } from './dto/update-pendeta.dto';

@ApiTags('Pendeta')
@Controller('pendeta')
export class PendetaController {
  constructor(private readonly pendetaService: PendetaService) {}

  @Post()
  create(@Body() createPendetaDto: CreatePendetaDto) {
    return this.pendetaService.create(createPendetaDto);
  }

  @Get()
  findAll() {
    return this.pendetaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.pendetaService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePendetaDto: UpdatePendetaDto) {
    return this.pendetaService.update(id, updatePendetaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.pendetaService.remove(id);
  }
}
