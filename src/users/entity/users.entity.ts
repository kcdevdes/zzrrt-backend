import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Exclude } from 'class-transformer';

@Schema()
export class OAuthProvider {
  @Prop({ required: true })
  provider: string;

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
  @Prop({ required: true })
  username: string;

  @Prop()
  @Exclude({
    toPlainOnly: true,
  })
  password: string;

  @Prop({ required: true })
  email: string;

  @Prop({ type: String, enum: Role, default: Role.user })
  @Exclude({
    toPlainOnly: true,
  })
  role: Role;

  @Prop({ type: OAuthProvider })
  oauthProvider: OAuthProvider;
}

export const UsersSchema = SchemaFactory.createForClass(Users);
