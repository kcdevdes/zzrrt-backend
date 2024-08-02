import { PartialType } from '@nestjs/mapped-types';
import { UserDocument } from '../entity/users.entity';

export class UpdateUserDto extends PartialType(UserDocument) {
  username: string;
  password: string;
}
