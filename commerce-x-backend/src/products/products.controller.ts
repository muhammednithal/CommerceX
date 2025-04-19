import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  ParseIntPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { RolesGuard } from 'src/auth/gaurds/roles.guard';
import { Role } from 'src/auth/role/role.enum';
import { Roles } from 'src/auth/decorator/roles.decorator';
import { JwtAuthGuard } from 'src/auth/gaurds/jwt-auth.guard';

@Controller('products')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post('categories')
  @Roles(Role.Admin)
  createCategory(@Body() dto: CreateCategoryDto) {
    return this.productsService.createCategory(dto);
  }

  @Get('categories')
  @Roles(Role.Admin)
  findAllCategories() {
    console.log('✅ findAllCategories route triggered');
    return this.productsService.findAllCategories();
  }
  @Get('categories/:id')
  @Roles(Role.Admin)
  findCategory(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.findCategoryById(id);
  }

  @Patch('categories/:id')
  @Roles(Role.Admin)
  updateCategory(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateCategoryDto,
  ) {
    return this.productsService.updateCategory(id, dto);
  }

  @Delete('categories/:id')
  @Roles(Role.Admin)
  deleteCategory(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.removeCategory(id);
  }

  @Get('search')
  @Roles(Role.Admin)
  searchProducts(@Query('query') query: string) {
    return this.productsService.searchProducts(query);
  }

  @Get('filter')
  @Roles(Role.Admin)
  filterProducts(
    @Query('categoryId') categoryId?: number,
    @Query('minPrice') minPrice?: number,
    @Query('maxPrice') maxPrice?: number,
    @Query('minRating') minRating?: number,
  ) {
    return this.productsService.filterProducts(
      categoryId ? Number(categoryId) : undefined,
      minPrice ? Number(minPrice) : undefined,
      maxPrice ? Number(maxPrice) : undefined,
      minRating ? Number(minRating) : undefined,
    );
  }

  @Post()
  @Roles(Role.Admin)
  create(@Body() dto: CreateProductDto) {
    return this.productsService.createProduct(dto);
  }

  @Get()
  @Roles(Role.Admin)
  findAll() {
    return this.productsService.findAllProducts();
  }

  @Get(':id')
  @Roles(Role.Admin)
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.findProductById(id);
  }

  @Patch(':id')
  @Roles(Role.Admin)
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateProductDto) {
    return this.productsService.updateProduct(id, dto);
  }

  @Delete(':id')
  @Roles(Role.Admin)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.removeProduct(id);
  }
}
