import {
  Controller,
  Post,
  Get,
  Patch,
  Param,
  Req,
  Body,
  UseGuards,
} from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { Request } from 'express';
import { JwtAuthGuard } from 'src/auth/gaurds/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post()
  createNotification(@Req() req: any, @Body('message') message: string) {
    const userId = req.user.id;
    return this.notificationsService.createInAppNotification(userId, message);
  }

  @Get()
  getNotifications(@Req() req: any) {
    const userId = req.user.id;
    return this.notificationsService.getNotifications(userId);
  }

  @Patch(':notificationId')
  markAsRead(@Param('notificationId') notificationId: number) {
    return this.notificationsService.markAsRead(Number(notificationId));
  }

  //dummy to test the mail will interate
  @Post('test-email')
  sendTestEmail(@Body('email') email: string) {
    return this.notificationsService.sendOrderConfirmation(email, 1234); // dummy order ID
  }
}
