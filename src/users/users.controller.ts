import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AccessTokenGuard } from '../auth/guards/bearer-token.guard';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':id')
  @UseGuards(AccessTokenGuard)
  async getUsers(@Param('id') _id: string, @Req() req) {
    this.usersService.authorizeRequest(req, _id);
    return this.usersService.findUserById(_id);
  }

  @Patch(':id')
  @UseGuards(AccessTokenGuard)
  async updateUser(
    @Param('id') _id: string,
    @Req() req,
    @Body() dto: UpdateUserDto,
  ) {
    this.usersService.authorizeRequest(req, _id);
    return this.usersService.updateUser(_id, dto);
  }

  @Delete(':id')
  @UseGuards(AccessTokenGuard)
  async deleteUser(@Param('id') _id: string, @Req() req) {
    this.usersService.authorizeRequest(req, _id);
    return this.usersService.deleteUser(_id);
  }
}
