import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';

@Injectable()
export class ReviewsService {
  constructor(private readonly prisma: PrismaService) {}

  async addReview(userId: number, productId: number, dto: CreateReviewDto) {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });
    if (!product) throw new NotFoundException('Product not found');

    return this.prisma.review.create({
      data: {
        rating: dto.rating,
        comment: dto.comment,
        user: { connect: { id: userId } },
        product: { connect: { id: productId } },
      },
    });
  }

  async updateReview(userId: number, reviewId: number, dto: UpdateReviewDto) {
    const review = await this.prisma.review.findFirst({
      where: { id: reviewId, userId },
    });
    if (!review) throw new NotFoundException('Review not found');

    return this.prisma.review.update({
      where: { id: reviewId },
      data: {
        rating: dto.rating,
        comment: dto.comment,
      },
    });
  }

  async deleteReview(userId: number, reviewId: number) {
    const review = await this.prisma.review.findFirst({
      where: { id: reviewId, userId },
    });
    if (!review) throw new NotFoundException('Review not found');

    await this.prisma.review.delete({ where: { id: reviewId } });
  }

  async getProductReviews(productId: number) {
    return this.prisma.review.findMany({
      where: { productId },
      include: {
        user: { select: { id: true, email: true } },
      },
    });
  }
}
