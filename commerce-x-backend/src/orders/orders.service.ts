import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async createOrder(dto: CreateOrderDto) {
    const { userId, items } = dto;

    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    const productIds = items.map((item) => item.productId);
    const products = await this.prisma.product.findMany({
      where: { id: { in: productIds } },
    });

    const orderItems = items.map((item) => {
      const product = products.find((p) => p.id === item.productId);
      if (!product)
        throw new NotFoundException(`Product ${item.productId} not found`);
      return {
        productId: product.id,
        quantity: item.quantity,
        price: Number(product.price) * item.quantity,
      };
    });

    const total = orderItems.reduce((sum, item) => sum + item.price, 0);

    return this.prisma.order.create({
      data: {
        userId,
        total,
        items: {
          create: orderItems,
        },
      },
      include: {
        items: {
          include: { product: true },
        },
        user: true,
      },
    });
  }

  async findAllOrders() {
    return this.prisma.order.findMany({
      include: {
        user: true,
        items: {
          include: {
            product: true,
          },
        },
      },
    });
  }

  async findOrderById(id: number) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        user: true,
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!order) throw new NotFoundException('Order not found');
    return order;
  }

  async updateOrderStatus(id: number, dto: UpdateOrderStatusDto) {
    await this.findOrderById(id); // throws if not found

    return this.prisma.order.update({
      where: { id },
      data: { status: dto.status },
    });
  }

  async removeOrder(id: number) {
    await this.findOrderById(id); // throws if not found

    await this.prisma.orderItem.deleteMany({ where: { orderId: id } });

    return this.prisma.order.delete({
      where: { id },
    });
  }
}
