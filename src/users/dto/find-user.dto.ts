import { Users } from '../entity/users.entity';
import { PickType } from '@nestjs/mapped-types';

export class FindUserDto extends PickType(Users, [
  '_id',
  'email',
  'oauthProvider',
  'username',
]) {}
