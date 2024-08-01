import { User } from '../entity/users.entity';
import { PickType } from '@nestjs/mapped-types';
import { IsOptional, IsString } from 'class-validator';

export class CreateUserDto extends PickType(User, [
  'email',
  'oauthProvider',
  'username',
]) {
  @IsString()
  @IsOptional()
  password?: string;
}
