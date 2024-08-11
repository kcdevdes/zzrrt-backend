import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { OAuthProvider, UserModel } from '../users/entity/users.entity';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async login(user) {
    if (!user) {
      throw new UnauthorizedException('No User Found in Request');
    }

    // registers the user if they don't exist
    const provider = new OAuthProvider();
    provider.provider = user.provider;
    provider.providerUserId = user.providerId;
    provider.providerAccessToken = user.accessToken;

    const creatUserDto = new CreateUserDto();
    creatUserDto.email = user.email;
    // if there is no lastname, make an empty string after firstname
    creatUserDto.username =
      user.firstName + (user.lastName ? user.lastName : '');
    creatUserDto.oauthProvider = provider;

    const newUser: UserModel =
      await this.usersService.findOrCreateUser(creatUserDto);

    return {
      access_token: this.signToken(newUser.email, newUser.id, false),
      refresh_token: this.signToken(newUser.email, newUser.id, true),
    };
  }

  signToken(email: string, _id: string, isRefreshToken: boolean) {
    /**
     * email, sub, type을 무조건 포함.
     */
    const payload = {
      sub: _id,
      email,
      type: isRefreshToken ? 'refresh' : 'access',
    };

    return this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_SECRET'),
      expiresIn: isRefreshToken ? 3600 : 3600,
    });
  }

  extractTokenFromHeader(header: string, isBearer: boolean) {
    const splitTokens = header.split(' ');

    // check if the token is in the correct format
    // if isBearer is true, the token should start with 'Bearer'
    // otherwise, it should start with 'Basic'
    if (
      splitTokens.length !== 2 ||
      splitTokens[0] !== (isBearer ? 'Bearer' : 'Basic')
    ) {
      throw new BadRequestException(
        'Token type must be either `Bearer` or `Basic`',
      );
    }

    return splitTokens[1];
  }

  decodeBasicToken(token: string) {
    const decoded = Buffer.from(token, 'base64').toString('utf8');
    const split = decoded.split(':');
    if (split.length !== 2) {
      throw new UnauthorizedException('Invalid Token');
    }

    const email = split[0];
    const password = split[1];

    return {
      email,
      password,
    };
  }

  verifyToken(token: string) {
    return this.jwtService.verify(token, {
      secret: this.configService.get<string>('JWT_SECRET'),
    });
  }

  /**
   * Rotates the token when the user requests a new access token or refresh token.
   * @param token
   * @param isRefreshToken
   * @returns
   */
  rotateToken(token: string, isRefreshToken: boolean) {
    const decoded = this.jwtService.verify(token, {
      secret: this.configService.get<string>('JWT_SECRET'),
    });

    if (!decoded.email || !decoded.sub || !decoded.type) {
      throw new BadRequestException('Invalid Token');
    }

    if (decoded.type !== 'refresh') {
      throw new UnauthorizedException('Token type must be `refresh`');
    }

    return this.signToken(decoded.email, decoded.id, isRefreshToken);
  }
}
