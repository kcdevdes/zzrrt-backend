import { PickType } from '@nestjs/mapped-types';
import { MatchCommentsModel } from '../entity/match-comments.entity';

export class CreateCommentDto extends PickType(MatchCommentsModel, [
  'comment',
]) {}
