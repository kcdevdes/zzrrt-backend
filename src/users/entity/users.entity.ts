import { IsEmail, IsOptional, IsString } from 'class-validator';
import { Exclude } from 'class-transformer';
import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  ObjectIdColumn,
  UpdateDateColumn,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

export enum Role {
  admin = 'ADMIN',
  user = 'USER',
  guest = 'GUEST',
}

export class OAuthProvider {
  @IsString()
  @Column()
  provider: string;

  @IsString()
  @Column()
  providerUserId: string;

  @IsString()
  @IsOptional()
  @Column()
  providerAccessToken: string;

  @IsString()
  @IsOptional()
  @Column()
  providerRefreshToken: string;
}

@Entity('users', {})
export class UserDocument {
  @ObjectIdColumn()
  _id: string;

  @IsString()
  @Column()
  username: string;

  @IsString()
  @IsOptional()
  @Column()
  password: string;

  @IsEmail()
  @Column()
  email: string;

  @IsString()
  @Column()
  @Column({
    enum: Role,
    default: Role.user,
  })
  role: Role;

  @Exclude()
  @Column(() => OAuthProvider)
  oauthProvider: OAuthProvider;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @BeforeInsert()
  generateId() {
    this._id = uuidv4();
  }
}
