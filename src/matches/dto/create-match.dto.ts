import { MatchDocument } from '../entity/matches.entity';
import { PickType } from '@nestjs/mapped-types';

export class CreateMatchDto extends PickType(MatchDocument, [
  'title',
  'description',
]) {}
