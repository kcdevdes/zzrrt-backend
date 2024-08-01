import { PartialType } from '@nestjs/mapped-types';
import { OAuthProvider, Role, Users } from '../entity/users.entity';
import {
  IsEmail,
  IsEnum,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';

export class UpdateUserDto extends PartialType(Users) {
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
