import {
  Column,
  Entity,
  Index,
  ManyToMany,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { UserModel } from '../../users/entity/users.entity';
import { IsBoolean, IsString, IsUrl } from 'class-validator';
import { BaseModel } from '../../common/entity/base.entity';
import { MatchOptionModel } from './match-options.entity';
import { MatchHistoryModel } from './match-histories.entity';
import { MatchCommentsModel } from '../../comments/entity/match-comments.entity';

@Entity()
@Index('idx_title', ['title'], { fulltext: true })
@Index('idx_description', ['description'], { fulltext: true })
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

  @IsUrl()
  @Column({ nullable: true })
  thumbnail: string;

  @OneToMany(() => MatchOptionModel, (matchOption) => matchOption.match)
  options: MatchOptionModel[];

  @OneToMany(() => MatchHistoryModel, (matchHistory) => matchHistory.match)
  histories: MatchHistoryModel[];

  @OneToMany(() => MatchCommentsModel, (comment) => comment.match)
  comments: MatchCommentsModel[];

  @ManyToMany(() => UserModel, (user) => user.likedMatches)
  likedUsers: UserModel[];
}
