import {
  Controller,
  Post,
  Body,
  Get,
  Patch,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from 'src/auth/gaurds/jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Req() req: any) {
    return req.user;
  }

  @UseGuards(JwtAuthGuard)
  @Patch('profile')
  async update(@Req() req: any, @Body() dto: UpdateUserDto) {
    const user = req.user;
    return this.usersService.update(user.id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('profile')
  async delete(@Req() req: any) {
    const user = req.user;
    return this.usersService.remove(user.id);
  }
}
