import { MatchModel } from '../entity/matches.entity';
import { PickType } from '@nestjs/mapped-types';

export class CreateMatchDto extends PickType(MatchModel, [
  'title',
  'description',
]) {}
