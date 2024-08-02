import { UserDocument } from '../entity/users.entity';
import { PickType } from '@nestjs/mapped-types';

export class CreateUserDto extends PickType(UserDocument, [
  '_id',
  'email',
  'oauthProvider',
  'username',
]) {
  password?: string;
}
