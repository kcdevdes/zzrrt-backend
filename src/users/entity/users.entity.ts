import { IsEmail, IsOptional, IsString } from 'class-validator';
import { Exclude } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { MatchModel } from '../../matches/entity/matches.entity';

export enum Role {
  ADMIN = 'admin',
  USER = 'user',
  GUEST = 'guest',
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
  @Column({ nullable: true })
  providerAccessToken: string;

  @IsString()
  @IsOptional()
  @Column({ nullable: true })
  providerRefreshToken: string;
}

@Entity()
export class UserModel {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @IsString()
  @Column()
  username: string;

  @IsString()
  @IsOptional()
  @Exclude()
  @Column({ nullable: true })
  password: string;

  @IsEmail()
  @Column()
  email: string;

  @Column({
    type: 'enum',
    enum: ['admin', 'user', 'guest'],
    default: 'user',
  })
  role: Role;

  @Exclude()
  @Column(() => OAuthProvider)
  oauthProvider: OAuthProvider;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @OneToMany(() => MatchModel, (match) => match.creator)
  matches: MatchModel[];
}
