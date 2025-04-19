import { Module } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ReportsController } from './reports.controller';

@Module({
  imports: [PrismaModule],
  providers: [ReportsService],
  controllers: [ReportsController],
})
export class ReportsModule {}
