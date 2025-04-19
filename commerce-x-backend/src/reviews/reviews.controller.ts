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
import { ReviewsService } from './reviews.service';
import { Request } from 'express';
import { JwtAuthGuard } from 'src/auth/gaurds/jwt-auth.guard';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';

@Controller('reviews')
@UseGuards(JwtAuthGuard)
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post(':productId')
  addReview(
    @Req() req: any,
    @Param('productId') productId: number,
    @Body() dto: CreateReviewDto,
  ) {
    return this.reviewsService.addReview(req.user.id, Number(productId), dto);
  }

  @Patch(':reviewId')
  updateReview(
    @Req() req: any,
    @Param('reviewId') reviewId: number,
    @Body() dto: UpdateReviewDto,
  ) {
    return this.reviewsService.updateReview(req.user.id, Number(reviewId), dto);
  }

  @Delete(':reviewId')
  deleteReview(@Req() req: any, @Param('reviewId') reviewId: number) {
    return this.reviewsService.deleteReview(req.user.id, Number(reviewId));
  }

  @Get('product/:productId')
  getProductReviews(@Param('productId') productId: number) {
    return this.reviewsService.getProductReviews(Number(productId));
  }
}
