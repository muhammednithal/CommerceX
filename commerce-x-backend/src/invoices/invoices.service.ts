import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as fs from 'fs';
import * as path from 'path';
const PDFDocument = require('pdfkit');

@Injectable()
export class InvoicesService {
  constructor(private readonly prisma: PrismaService) {}

  async generateInvoice(orderId: number): Promise<string> {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: {
        user: true,
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    const invoicePath = path.join('invoices', `invoice_${order.id}.pdf`);

    const doc = new PDFDocument();
    doc.pipe(fs.createWriteStream(invoicePath));

    // Header
    doc.fontSize(20).text('INVOICE', { align: 'center' }).moveDown();
    doc.fontSize(14).text(`Invoice #: ${order.id}`);
    doc.text(`Date: ${order.createdAt.toDateString()}`);
    doc.moveDown();

    // Customer Info
    doc.text(`Customer: ${order.user.profile}`);
    doc.text(`Email: ${order.user.email}`);
    doc.moveDown();

    // Order Items
    doc.fontSize(16).text('Items:');
    doc.moveDown();
    order.items.forEach((item) => {
      doc
        .fontSize(12)
        .text(
          `${item.product.name} - ${item.quantity} x $${item.price.toFixed(2)}`,
        );
    });

    // Total
    doc.moveDown();
    doc
      .fontSize(14)
      .text(`Total: $${order.total.toFixed(2)}`, { align: 'right' });

    doc.end();
    return invoicePath;
  }
}
