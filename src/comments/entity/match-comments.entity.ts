import { BaseModel } from '../../common/entity/base.entity';
import { AfterUpdate, Column, Entity, ManyToOne } from 'typeorm';
import { UserModel } from '../../users/entity/users.entity';
import { MatchModel } from '../../matches/entity/matches.entity';

@Entity()
export class MatchCommentsModel extends BaseModel {
  @Column()
  comment: string;

  @ManyToOne(() => UserModel, (user) => user.comments)
  user: UserModel;

  @ManyToOne(() => MatchModel, (match) => match.comments)
  match: MatchModel;

  @Column()
  isEdited: boolean = false;

  @AfterUpdate()
  updateCounters() {
    this.isEdited = true;
  }
}
