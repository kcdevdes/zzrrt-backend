import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { UserModel } from '../../users/entity/users.entity';
import { IsBoolean, IsString } from 'class-validator';
import { BaseModel } from '../../common/entity/base.entity';
import { MatchOptionModel } from './match-options.entity';
import { MatchHistoryModel } from './match-histories.entity';
import { MatchCommentsModel } from '../../comments/entity/match-comments.entity';

@Entity()
export class MatchModel extends BaseModel {
  @ManyToOne(() => UserModel, (user) => user.myMatches, {
    nullable: false,
    onDelete: 'CASCADE',
  })
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

  @OneToMany(() => MatchOptionModel, (matchOption) => matchOption.match, {})
  options: MatchOptionModel[];

  @OneToMany(() => MatchHistoryModel, (matchHistory) => matchHistory.match, {
    nullable: true,
  })
  histories: MatchHistoryModel[];

  @OneToMany(() => MatchCommentsModel, (comment) => comment.match, {
    nullable: true,
  })
  comments: MatchCommentsModel[];

  @OneToMany(() => UserModel, (user) => user.likedMatches, {
    nullable: true,
  })
  likedUsers: UserModel[];
}
