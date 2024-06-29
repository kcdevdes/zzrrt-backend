import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ required: true })
  username: string;
  @Prop({ required: true, unique: true })
  email: string;
  @Prop()
  password: string;
  @Prop({ type: Object })
  oauthProvider: OAuthProvider;
  @Prop({ type: Date, default: Date.now })
  createdAt: Date;
  @Prop({ type: Date, default: Date.now })
  updatedAt: Date;
  @Prop({ default: 'user', type: String, enum: ['ADMIN', 'USER'] })
  role: Role;
}

type OAuthProvider = {
  provider: string;
  providerId: string;
};

type Role = 'ADMIN' | 'USER';

export const UserSchema = SchemaFactory.createForClass(User);
