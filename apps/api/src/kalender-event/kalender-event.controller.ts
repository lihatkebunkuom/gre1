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
import { KalenderEventService } from './kalender-event.service';
import { CreateKalenderEventDto } from './dto/create-kalender-event.dto';
import { UpdateKalenderEventDto } from './dto/update-kalender-event.dto';

@ApiTags('Kalender Event')
@Controller('kalender-event')
export class KalenderEventController {
  constructor(private readonly kalenderEventService: KalenderEventService) {}

  @Post()
  @ApiOperation({ summary: 'Create new Calendar Event' })
  @ApiResponse({ status: 201, description: 'The event has been successfully created.' })
  create(@Body() createKalenderEventDto: CreateKalenderEventDto) {
    return this.kalenderEventService.create(createKalenderEventDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all Calendar Events' })
  @ApiResponse({ status: 200, description: 'List of all events.' })
  findAll() {
    return this.kalenderEventService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get Event by ID' })
  @ApiResponse({ status: 200, description: 'The found event.' })
  @ApiResponse({ status: 404, description: 'Event not found.' })
  findOne(@Param('id') id: string) {
    return this.kalenderEventService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update Event' })
  @ApiResponse({ status: 200, description: 'The event has been successfully updated.' })
  update(
    @Param('id') id: string,
    @Body() updateKalenderEventDto: UpdateKalenderEventDto,
  ) {
    return this.kalenderEventService.update(id, updateKalenderEventDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete Event' })
  @ApiResponse({ status: 200, description: 'The event has been successfully deleted.' })
  remove(@Param('id') id: string) {
    return this.kalenderEventService.remove(id);
  }
}