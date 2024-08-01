import {
  Controller,
  Get,
  UseGuards,
  Req,
  UnauthorizedException,
  Post,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import {
  AccessTokenGuard,
  RefreshTokenGuard,
} from './guards/bearer-token.guard';
import { Users } from 'src/users/entity/users.entity';
import { User } from 'src/users/decorator/user.decorator';

@Controller('login')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req) {}

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req) {
    return await this.authService.login(req.user);
  }

  @Get('status')
  @UseGuards(AccessTokenGuard)
  async getLoginResult(@Req() req) {
    if (!req.user) {
      throw new UnauthorizedException('User not found');
    }

    const user = req.user as Users;

    return {
      _id: user._id,
      email: user.email,
      username: user.username,
    };
  }

  @Post('token/access')
  @UseGuards(RefreshTokenGuard)
  async postTokenAccess(@Req() req) {
    const newToken = this.authService.rotateToken(req['token'], false);

    return {
      accessToken: newToken,
    };
  }

  @Post('token/refresh')
  @UseGuards(RefreshTokenGuard)
  async postTokenRefresh(@Req() req) {
    const newToken = this.authService.rotateToken(req['token'], true);

    return {
      refreshToken: newToken,
    };
  }
}
