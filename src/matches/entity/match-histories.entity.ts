import {
  BeforeInsert,
  Column,
  Entity,
  ManyToOne,
  ObjectIdColumn,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { MatchDocument } from './matches.entity';

@Entity('match-histories')
export class MatchHistoryDocument {
  @ObjectIdColumn()
  _id: string;

  @ManyToOne(() => MatchDocument, (match) => match.history)
  match: MatchDocument;

  @Column()
  playedAt: Date;

  @Column(() => Choice)
  choices: Choice[];

  @BeforeInsert()
  generateId() {
    if (!this._id) {
      this._id = uuidv4();
    }
  }
}

@Entity()
class Choice {
  @Column()
  optionAId: string;

  @Column()
  optionBId: string;

  @Column()
  choiceId: string;
}
