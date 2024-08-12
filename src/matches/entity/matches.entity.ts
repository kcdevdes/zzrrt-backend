import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { UserModel } from '../../users/entity/users.entity';
import { IsBoolean, IsString } from 'class-validator';
import { BaseModel } from '../../common/entity/base.entity';
import { MatchOptionModel } from './match-options.entity';
import { MatchHistoryModel } from './match-histories.entity';

@Entity()
export class MatchModel extends BaseModel {
  @ManyToOne(() => UserModel, (user) => user.myMatches, { nullable: false })
  creator: UserModel;

  @IsString()
  @Column()
  title: string;

  @IsString()
  @Column()
  description: string;

  @IsBoolean()
  @Column()
  isPublic: boolean = false;

  @OneToMany(() => MatchOptionModel, (matchOption) => matchOption.matchId)
  options: MatchOptionModel[];

  @OneToMany(() => MatchHistoryModel, (matchHistory) => matchHistory.matchId, {
    nullable: true,
  })
  histories: MatchHistoryModel[];
}
