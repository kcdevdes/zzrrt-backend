import { PartialType } from '@nestjs/mapped-types';
import { UserModel } from '../entity/users.entity';

export class UpdateUserDto extends PartialType(UserModel) {
  username: string;
  password: string;
}
