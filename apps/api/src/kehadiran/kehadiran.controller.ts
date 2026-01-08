import {
  Controller,
  Get,
  Post,
  Body,
  Param,
} from '@nestjs/common';
import { KehadiranService } from './kehadiran.service';
import { ScanQrDto } from './dto/scan-qr.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Kehadiran')
@Controller('kehadiran')
export class KehadiranController {
  constructor(private readonly kehadiranService: KehadiranService) {}

  @Post('scan')
  @ApiOperation({ summary: 'Scan QR Code untuk mencatat kehadiran' })
  scan(@Body() scanQrDto: ScanQrDto) {
    return this.kehadiranService.scan(scanQrDto);
  }

  @Get('jemaat/:jemaatId')
  @ApiOperation({ summary: 'Ambil riwayat kehadiran jemaat' })
  findByJemaat(@Param('jemaatId') jemaatId: string) {
    return this.kehadiranService.findByJemaat(jemaatId);
  }

  @Get()
  @ApiOperation({ summary: 'Ambil semua data kehadiran (Admin)' })
  findAll() {
    return this.kehadiranService.findAll();
  }
}
