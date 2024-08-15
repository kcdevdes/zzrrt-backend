import { UserModel } from '../entity/users.entity';
import { PickType } from '@nestjs/mapped-types';

export class CreateUserDto extends PickType(UserModel, [
  'id',
  'email',
  'oauthProvider',
  'username',
]) {
  password?: string;
}
