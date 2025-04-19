import { Injectable, NotFoundException } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class NotificationsService {
  private transporter: nodemailer.Transporter;

  constructor(private prisma: PrismaService) {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  // EMAIL NOTIFICATIONS
  async sendOrderConfirmation(email: string, orderId: number) {
    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: 'Order Confirmation',
      text: `Your order with ID ${orderId} has been confirmed.`,
    };

    await this.transporter.sendMail(mailOptions);
  }

  async sendShippingUpdate(email: string, orderId: number, status: string) {
    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: 'Shipping Update',
      text: `Your order with ID ${orderId} is now ${status}.`,
    };

    await this.transporter.sendMail(mailOptions);
  }

  // IN-APP NOTIFICATIONS
  async createInAppNotification(userId: number, message: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.prisma.notification.create({
      data: {
        userId,
        message,
      },
    });
  }

  async getNotifications(userId: number) {
    return this.prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async markAsRead(notificationId: number) {
    const notification = await this.prisma.notification.findUnique({
      where: { id: notificationId },
    });

    if (!notification) {
      throw new NotFoundException('Notification not found');
    }

    return this.prisma.notification.update({
      where: { id: notificationId },
      data: { read: true },
    });
  }
}
