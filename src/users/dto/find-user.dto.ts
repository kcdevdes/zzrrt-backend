import { User } from '../entity/users.entity';
import { PickType } from '@nestjs/mapped-types';

export class FindUserDto extends PickType(User, [
  'email',
  'oauthProvider',
  'username',
]) {}
