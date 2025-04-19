import {
  Controller,
  Post,
  Delete,
  Get,
  Param,
  Req,
  UseGuards,
} from '@nestjs/common';
import { WishlistService } from './wishlist.service';
import { Request } from 'express';
import { JwtAuthGuard } from 'src/auth/gaurds/jwt-auth.guard';

@Controller('wishlist')
@UseGuards(JwtAuthGuard)
export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) {}

  @Post(':productId')
  addToWishlist(@Req() req: any, @Param('productId') productId: number) {
    const userId = req.user.id;
    return this.wishlistService.addToWishlist(userId, +productId);
  }

  @Delete(':productId')
  removeFromWishlist(@Req() req: any, @Param('productId') productId: number) {
    const userId = req.user.id;
    return this.wishlistService.removeFromWishlist(userId, +productId);
  }

  @Get()
  viewWishlist(@Req() req: any) {
    const userId = req.user.id;
    return this.wishlistService.viewWishlist(userId);
  }
}
