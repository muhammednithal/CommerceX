import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Param,
  Body,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { Request } from 'express';
import { CreateCartItemDto } from './dto/create-cart-item.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { JwtAuthGuard } from 'src/auth/gaurds/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post('add')
  addItem(@Req() req: any, @Body() dto: CreateCartItemDto) {
    const userId = req.user.id;
    return this.cartService.addItem(userId, dto);
  }

  @Patch('update/:itemId')
  updateItem(
    @Req() req: any,
    @Param('itemId') itemId: number,
    @Body() dto: UpdateCartItemDto,
  ) {
    const userId = req.user.id;
    return this.cartService.updateItem(userId, Number(itemId), dto);
  }

  @Delete('remove/:itemId')
  removeItem(@Req() req: any, @Param('itemId') itemId: number) {
    const userId = req.user.id;
    return this.cartService.removeItem(userId, Number(itemId));
  }

  @Get('summary')
  getCartSummary(@Req() req: any) {
    const userId = req.user.id;
    return this.cartService.getCartSummary(userId);
  }

  @Post('checkout')
  async checkout(@Req() req: any) {
    const userId = req.user.id;
    await this.cartService.clearCart(userId);
    return { message: 'Checkout successful' };
  }
}
