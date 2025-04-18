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
}
