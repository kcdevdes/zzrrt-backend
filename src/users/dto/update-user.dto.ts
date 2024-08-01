import { PartialType } from '@nestjs/mapped-types';
import { OAuthProvider, Role, User } from '../entity/users.entity';
import {
  IsEmail,
  IsEnum,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';

export class UpdateUserDto extends PartialType(User) {
  @IsString()
  @IsOptional()
  username: string;

  @IsString()
  @IsOptional()
  password: string;

  @IsEmail()
  @IsOptional()
  email: string;

  @IsEnum(Role)
  @IsOptional()
  role: Role;

  @IsObject()
  @IsOptional()
  oauthProvider: OAuthProvider;
}
