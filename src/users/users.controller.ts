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
import { ApiTags } from '@nestjs/swagger';

@Controller('users')
@ApiTags('User API')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':id')
  @UseGuards(AccessTokenGuard)
  async getUsers(@Param('id') id: string, @Req() req) {
    this.usersService.authorizeRequest(req, id);
    return this.usersService.findUserById(id);
  }

  @Patch(':id')
  @UseGuards(AccessTokenGuard)
  async updateUser(
    @Param('id') id: string,
    @Req() req,
    @Body() dto: UpdateUserDto,
  ) {
    this.usersService.authorizeRequest(req, id);
    return this.usersService.updateUser(id, dto);
  }

  @Delete(':id')
  @UseGuards(AccessTokenGuard)
  async deleteUser(@Param('id') id: string, @Req() req) {
    this.usersService.authorizeRequest(req, id);
    return this.usersService.deleteUser(id);
  }
}
