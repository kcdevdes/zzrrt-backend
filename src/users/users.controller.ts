import {
  BadRequestException,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  Param,
  ParseIntPipe,
  Patch,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { AccessTokenGuard } from '../auth/guards/bearer-token.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':id')
  @UseGuards(AccessTokenGuard)
  async getUsers(@Param('id', ParseIntPipe) id: number, @Req() req) {
    this.usersService.authorizeRequest(req, id);

    return this.usersService.findUserById(id);
  }

  @Patch(':id')
  @UseGuards(AccessTokenGuard)
  async updateUser(@Param('id', ParseIntPipe) id: number, @Req() req) {
    this.usersService.authorizeRequest(req, id);

    try {
      return this.usersService.updateUser(id, req.body);
    } catch (error) {
      throw new InternalServerErrorException('Error deleting user');
    }
  }

  @Delete(':id')
  @UseGuards(AccessTokenGuard)
  async deleteUser(@Param('id', ParseIntPipe) id: number, @Req() req) {
    this.usersService.authorizeRequest(req, id);

    try {
      return this.usersService.deleteUser(id);
    } catch (error) {
      throw new InternalServerErrorException('Error deleting user');
    }
  }
}
