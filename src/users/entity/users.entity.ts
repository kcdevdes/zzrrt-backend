import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { v4 } from 'uuid';

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
  @Prop({
    type: String,
    default: function genUUID() {
      return v4();
    },
  })
  _id: string;

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

export const UsersSchema = SchemaFactory.createForClass(Users);
