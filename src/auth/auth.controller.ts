import {
  Controller,
  Get,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import {
  AccessTokenGuard,
  RefreshTokenGuard,
} from './guards/bearer-token.guard';
import { UserDocument } from 'src/users/entity/users.entity';
import {
  ApiOkResponse,
  ApiOperation,
  ApiPermanentRedirectResponse,
  ApiTags,
} from '@nestjs/swagger';

@Controller('login')
@ApiTags('Authorization API')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('google')
  @UseGuards(AuthGuard('google'))
  @ApiOperation({
    summary: 'Google OAuth Endpoint',
    description: 'Accepts login requests via Google OAuth progress',
  })
  @ApiPermanentRedirectResponse({
    description: 'redirects users to a designated callback URL',
  })
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async googleAuth(@Req() req) {}

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  @ApiOperation({
    summary: 'Google OAuth Redirect URL',
    description: 'Not an endpoint. No request via this route',
  })
  @ApiOkResponse({
    description:
      'returns AccessToken and RefreshToken made of user information',
  })
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async googleAuthRedirect(@Req() req) {
    return await this.authService.login(req.user);
  }

  @Get('status')
  @UseGuards(AccessTokenGuard)
  @ApiOperation({
    summary: 'Token validity',
    description: 'Checks if the token that a bearer is holding is valid',
  })
  @ApiOkResponse({
    description: 'returns User object',
  })
  async getLoginResult(@Req() req) {
    if (!req.user) {
      throw new UnauthorizedException('User not found');
    }

    return req.user as UserDocument;
  }

  @Post('token/access')
  @UseGuards(RefreshTokenGuard)
  @ApiOperation({
    summary: 'Issuing a new AccessToken',
    description:
      'issues a new access token only if the refresh token a user submits is valid',
  })
  @ApiOkResponse({
    description: 'returns a new access token',
  })
  async postTokenAccess(@Req() req) {
    const newToken = this.authService.rotateToken(req['token'], false);

    return {
      accessToken: newToken,
    };
  }

  @Post('token/refresh')
  @UseGuards(RefreshTokenGuard)
  @ApiOperation({
    summary: 'Issuing a new RefreshToken',
    description:
      'issues a new refresh token only if the refresh token a user submits is valid',
  })
  @ApiOkResponse({
    description: 'returns a new refresh token',
  })
  async postTokenRefresh(@Req() req) {
    const newToken = this.authService.rotateToken(req['token'], true);

    return {
      refreshToken: newToken,
    };
  }
}
