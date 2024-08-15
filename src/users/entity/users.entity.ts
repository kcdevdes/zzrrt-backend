import { IsEmail, IsOptional, IsString } from 'class-validator';
import { Exclude } from 'class-transformer';
import { Column, Entity, OneToMany } from 'typeorm';
import { MatchModel } from '../../matches/entity/matches.entity';
import { BaseModel } from '../../common/entity/base.entity';
import { MatchHistoryModel } from '../../matches/entity/match-histories.entity';

export enum Role {
  ADMIN = 'admin',
  USER = 'user',
}

export class OAuthProvider {
  @IsString()
  @Column({ nullable: true })
  provider: string;

  @IsString()
  @Column({ nullable: true })
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
export class UserModel extends BaseModel {
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
    enum: Object.values(Role),
    default: Role.USER,
  })
  @Exclude()
  role: Role;

  @IsOptional()
  @Exclude()
  @Column(() => OAuthProvider)
  oauthProvider: OAuthProvider;

  @OneToMany(() => MatchModel, (match) => match.creator)
  myMatches: MatchModel[];

  @OneToMany(() => MatchHistoryModel, (matchHistory) => matchHistory.creator)
  myHistories: MatchHistoryModel[];
}
