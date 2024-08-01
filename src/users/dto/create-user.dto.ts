import { Users } from '../entity/users.entity';
import { PickType } from '@nestjs/mapped-types';

export class CreateUserDto extends PickType(Users, [
  '_id',
  'email',
  'oauthProvider',
  'username',
]) {
  password?: string;
}
