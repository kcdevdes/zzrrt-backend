import {
  Controller,
  Get,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { AccessTokenGuard } from 'src/auth/guards/bearer-token.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @UseGuards(AccessTokenGuard)
  getUser(@Req() req) {
    if (!req) {
      throw new UnauthorizedException('No User Found in Request');
    }
    return this.usersService.findUserByEmail(req.user.email);
  }
}
