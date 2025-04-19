import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { JwtAuthGuard } from 'src/auth/gaurds/jwt-auth.guard';
import { RolesGuard } from 'src/auth/gaurds/roles.guard';
import { Role } from 'src/auth/role/role.enum';
import { Roles } from 'src/auth/decorator/roles.decorator';
@Controller('orders')
@UseGuards(JwtAuthGuard, RolesGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  create(@Body() dto: CreateOrderDto) {
    return this.ordersService.createOrder(dto);
  }

  @Get()
  @Roles(Role.Admin)
  findAll() {
    return this.ordersService.findAllOrders();
  }

  @Get(':id')
  @Roles(Role.Admin)
  findOne(@Param('id') id: string) {
    return this.ordersService.findOrderById(Number(id));
  }

  @Patch(':id/status')
  @Roles(Role.Admin)
  updateStatus(@Param('id') id: string, @Body() dto: UpdateOrderStatusDto) {
    return this.ordersService.updateOrderStatus(Number(id), dto);
  }

  @Delete(':id')
  @Roles(Role.Admin)
  remove(@Param('id') id: string) {
    return this.ordersService.removeOrder(Number(id));
  }
}
