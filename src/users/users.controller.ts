import {
  BadRequestException,
  Controller,
  Get,
  InternalServerErrorException,
  Param,
  ParseIntPipe,
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
    if (!req) {
      throw new InternalServerErrorException('Request not found');
    }

    if (!req.user) {
      throw new BadRequestException('User not found in request');
    }

    if (req.user.id !== id) {
      throw new UnauthorizedException(
        'User not authorized to access this resource',
      );
    }

    return this.usersService.findUserById(id);
  }
}
