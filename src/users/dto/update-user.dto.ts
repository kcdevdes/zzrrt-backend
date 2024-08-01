import { PartialType } from '@nestjs/mapped-types';
import { Users } from '../entity/users.entity';

export class UpdateUserDto extends PartialType(Users) {
  username: string;
  password: string;
}
