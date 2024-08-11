import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserModel } from '../../users/entity/users.entity';
import { IsBoolean, IsString } from 'class-validator';

// import { MatchHistoryDocument } from './match-histories.entity';

@Entity()
export class MatchModel {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => UserModel, (user) => user.matches, { nullable: false })
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

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
