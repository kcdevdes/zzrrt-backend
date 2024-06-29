import { Controller, Get, Req } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('/:id')
  async getProfile(@Req() req) {
    console.log(req.user);
    return this.userService.getProfile(req.user.email);
  }
}
