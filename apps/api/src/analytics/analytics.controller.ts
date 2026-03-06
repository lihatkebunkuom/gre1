import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AnalyticsService } from './analytics.service';

@ApiTags('Analytics')
@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('summary')
  @ApiOperation({ summary: 'Mendapatkan ringkasan data KPI' })
  @ApiResponse({ status: 200, description: 'Data KPI berhasil diambil' })
  getSummary() {
    return this.analyticsService.getSummary();
  }

  @Get('finance-trend')
  @ApiOperation({ summary: 'Mendapatkan tren arus kas 6 bulan terakhir' })
  getFinanceTrend() {
    return this.analyticsService.getFinanceTrend();
  }

  @Get('demographics')
  @ApiOperation({ summary: 'Mendapatkan statistik demografi jemaat' })
  getDemographics() {
    return this.analyticsService.getDemographics();
  }
}
