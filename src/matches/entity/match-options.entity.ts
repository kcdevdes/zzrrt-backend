import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseModel } from '../../common/entity/base.entity';
import { MatchModel } from './matches.entity';
import { IsOptional, IsString, IsUrl } from 'class-validator';

@Entity()
export class MatchOptionModel extends BaseModel {
  @ManyToOne(() => MatchModel, (match) => match.options, {
    onDelete: 'CASCADE',
  })
  match: string;

  @IsString()
  @Column()
  name: string;

  @IsString()
  @IsOptional()
  @Column({ nullable: true })
  description: string;

  @IsUrl()
  @IsOptional()
  @Column({ nullable: true })
  resourceUrl: string;
}
