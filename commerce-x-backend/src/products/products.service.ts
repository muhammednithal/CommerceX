import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async createProduct(dto: CreateProductDto) {
    const category = await this.prisma.category.findUnique({
      where: { id: dto.categoryId },
    });
    if (!category) throw new NotFoundException('Category not found');

    return this.prisma.product.create({
      data: {
        ...dto,
        price: +dto.price,
      },
    });
  }

  async findAllProducts() {
    return this.prisma.product.findMany({ include: { category: true } });
  }

  async findProductById(id: number) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: { category: true },
    });
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  async updateProduct(id: number, dto: UpdateProductDto) {
    await this.findProductById(id); // ensures product exists

    if (dto.categoryId) {
      const category = await this.prisma.category.findUnique({
        where: { id: dto.categoryId },
      });
      if (!category) throw new NotFoundException('Category not found');
    }

    return this.prisma.product.update({
      where: { id },
      data: {
        ...dto,
        price: dto.price !== undefined ? +dto.price : undefined,
      },
    });
  }

  async removeProduct(id: number) {
    await this.findProductById(id);
    return this.prisma.product.delete({ where: { id } });
  }

  async createCategory(dto: CreateCategoryDto) {
    return this.prisma.category.create({ data: dto });
  }

  async findAllCategories() {
    return this.prisma.category.findMany({ include: { products: true } });
  }

  async findCategoryById(id: number) {
    const category = await this.prisma.category.findUnique({
      where: { id },
      include: { products: true },
    });
    if (!category) throw new NotFoundException('Category not found');
    return category;
  }

  async updateCategory(id: number, dto: UpdateCategoryDto) {
    await this.findCategoryById(id);
    return this.prisma.category.update({ where: { id }, data: dto });
  }

  async removeCategory(id: number) {
    await this.findCategoryById(id);
    return this.prisma.category.delete({ where: { id } });
  }

  async searchProducts(query: string) {
    return this.prisma.product.findMany({
      where: {
        OR: [
          {
            name: {
              contains: query,
              mode: 'insensitive',
            },
          },
          {
            description: {
              contains: query,
              mode: 'insensitive',
            },
          },
        ],
      },
    });
  }

  async filterProducts(
    categoryId?: number,
    minPrice?: number,
    maxPrice?: number,
    minRating?: number,
  ) {
    // Step 1: Fetch products with reviews
    const products = await this.prisma.product.findMany({
      where: {
        categoryId: categoryId,
        price: {
          gte: minPrice || undefined,
          lte: maxPrice || undefined,
        },
      },
      include: {
        reviews: {
          select: { rating: true },
        },
      },
    });

    // Step 2: Filter by computed average rating in memory (since not stored in DB)
    const filtered = products.filter((product) => {
      if (!minRating) return true;

      const ratings = product.reviews.map((r) => r.rating);
      const avgRating =
        ratings.length > 0
          ? ratings.reduce((sum, r) => sum + r, 0) / ratings.length
          : 0;

      return avgRating >= minRating;
    });

    // Optionally attach averageRating field for client use
    return filtered.map((product) => {
      const ratings = product.reviews.map((r) => r.rating);
      const avgRating =
        ratings.length > 0
          ? ratings.reduce((sum, r) => sum + r, 0) / ratings.length
          : 0;

      return {
        ...product,
        averageRating: parseFloat(avgRating.toFixed(2)),
      };
    });
  }
}
