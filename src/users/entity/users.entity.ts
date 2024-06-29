import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

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
export class User {
  @Prop({ required: true })
  username: string;

  @Prop()
  password: string;

  @Prop({ required: true })
  email: string;

  @Prop({ type: String, enum: Role, default: Role.user })
  role: Role;

  @Prop({ type: OAuthProvider })
  oauthProvider: OAuthProvider;
}

export const UserSchema = SchemaFactory.createForClass(User);
