import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsEmail, IsEnum, IsObject, IsString } from 'class-validator';
import { Exclude } from 'class-transformer';

@Schema()
export class OAuthProvider {
  @IsString()
  @Prop({ required: true })
  provider: string;

  @IsString()
  @Prop({ required: true })
  providerUserId: string;
}

export enum Role {
  admin = 'ADMIN',
  user = 'USER',
  guest = 'GUEST',
}

@Schema({ timestamps: true })
export class Users {
  @IsString()
  @Prop({ required: true })
  username: string;

  @IsString()
  @Prop()
  @Exclude({
    toPlainOnly: true,
  })
  password: string;

  @IsEmail()
  @Prop({ required: true })
  email: string;

  @IsEnum(Role)
  @Prop({ type: String, enum: Role, default: Role.user })
  @Exclude({
    toPlainOnly: true,
  })
  role: Role;

  @Prop({ type: OAuthProvider })
  oauthProvider: OAuthProvider;
}

export const UsersSchema = SchemaFactory.createForClass(Users);
