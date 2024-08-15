import { MatchModel } from '../entity/matches.entity';
import { PickType } from '@nestjs/mapped-types';
import { MatchOptionModel } from '../entity/match-options.entity';

export class OptionDto extends PickType(MatchOptionModel, [
  'name',
  'description',
  'resourceUrl',
]) {}

export class CreateMatchDto extends PickType(MatchModel, [
  'title',
  'description',
]) {
  options: OptionDto[];
}
