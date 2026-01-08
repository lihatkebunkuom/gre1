import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { QrSessionService } from './qr-session.service';
import { CreateQrSessionDto } from './dto/create-qr-session.dto';
import { UpdateQrSessionDto } from './dto/update-qr-session.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Kehadiran (QR Session)')
@Controller('kehadiran/qr-session')
export class QrSessionController {
  constructor(private readonly qrSessionService: QrSessionService) {}

  @Post()
  @ApiOperation({ summary: 'Buat sesi QR Kehadiran baru' })
  create(@Body() createQrSessionDto: CreateQrSessionDto) {
    return this.qrSessionService.create(createQrSessionDto);
  }

  @Get()
  @ApiOperation({ summary: 'Ambil semua sesi QR Kehadiran' })
  findAll() {
    return this.qrSessionService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Ambil detail sesi QR Kehadiran' })
  findOne(@Param('id') id: string) {
    return this.qrSessionService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update sesi QR Kehadiran' })
  update(
    @Param('id') id: string,
    @Body() updateQrSessionDto: UpdateQrSessionDto,
  ) {
    return this.qrSessionService.update(id, updateQrSessionDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Hapus sesi QR Kehadiran' })
  remove(@Param('id') id: string) {
    return this.qrSessionService.remove(id);
  }
}
