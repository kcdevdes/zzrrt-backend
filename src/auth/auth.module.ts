import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { GoogleStrategy } from './google.strategy';
import { UsersService } from 'src/users/users.service';
import { UsersModule } from 'src/users/users.module';
import { JwtService } from '@nestjs/jwt';
import {
  AccessTokenGuard,
  BearerTokenGuard,
  RefreshTokenGuard,
} from './guards/bearer-token.guard';

@Module({
  imports: [forwardRef(() => UsersModule)],
  controllers: [AuthController],
  providers: [
    UsersService,
    AuthService,
    GoogleStrategy,
    JwtService,
    BearerTokenGuard,
    AccessTokenGuard,
    RefreshTokenGuard,
  ],
  exports: [RefreshTokenGuard, AuthService],
})
export class AuthModule {}
