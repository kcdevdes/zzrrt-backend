import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class GoogleGuard extends AuthGuard('google') {
  async canActivate(context) {
    const request = context.switchToHttp().getRequest();

    await super.logIn(request);
    return true;
  }
}
