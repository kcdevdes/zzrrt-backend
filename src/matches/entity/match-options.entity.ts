import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseModel } from '../../common/entity/base.entity';
import { MatchModel } from './matches.entity';
import { IsString, IsUrl } from 'class-validator';

@Entity()
export class MatchOptionModel extends BaseModel {
  @ManyToOne(() => MatchModel, (match) => match.options)
  matchId: string;

  @IsString()
  @Column()
  title: string;

  @IsString()
  @Column()
  content: string;

  @IsUrl()
  @Column()
  resourceUrl: string;
}
