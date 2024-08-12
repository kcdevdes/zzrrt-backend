import { Entity, ManyToOne, OneToMany } from 'typeorm';
import { BaseModel } from '../../common/entity/base.entity';
import { MatchModel } from './matches.entity';
import { UserModel } from '../../users/entity/users.entity';
import { MatchChoiceModel } from './match-choices.entity';

@Entity()
export class MatchHistoryModel extends BaseModel {
  @ManyToOne(() => MatchModel, (match) => match.histories)
  matchId: string;

  @ManyToOne(() => UserModel, (user) => user.myHistories, { nullable: true })
  userId: UserModel;

  @OneToMany(() => MatchChoiceModel, (choice) => choice.matchHistoryId, {
    nullable: true,
  })
  choices: MatchChoiceModel[];
}
