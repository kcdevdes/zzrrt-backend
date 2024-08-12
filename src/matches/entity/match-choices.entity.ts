import {
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { MatchOptionModel } from './match-options.entity';
import { MatchHistoryModel } from './match-histories.entity';

@Entity()
export class MatchChoiceModel {
  /**
   * We don't need to search this id.
   * No need to extend BaseModel.
   */
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => MatchHistoryModel, (history) => history.choices)
  matchHistoryId: MatchHistoryModel;

  @CreateDateColumn()
  createdAt: Date; // playedAt

  @ManyToMany(() => MatchOptionModel, { eager: true })
  @JoinTable()
  allOptions: MatchOptionModel[];

  @ManyToOne(() => MatchOptionModel, { eager: true })
  selectedOption: MatchOptionModel;
}
