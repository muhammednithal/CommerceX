import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { RolesGuard } from 'src/auth/gaurds/roles.guard';
import { Role } from 'src/auth/role/role.enum';
import { Roles } from 'src/auth/decorator/roles.decorator';
import { JwtAuthGuard } from 'src/auth/gaurds/jwt-auth.guard';

@Controller('reports')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('sales')
  @Roles(Role.Admin)
  getSalesReport(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return this.reportsService.getSalesReport(
      new Date(startDate),
      new Date(endDate),
    );
  }

  @Get('analytics')
  @Roles(Role.Admin)
  getAnalytics() {
    return this.reportsService.getAnalytics();
  }
}
