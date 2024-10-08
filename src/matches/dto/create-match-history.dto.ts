import { IsArray, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateMatchHistoryDto {
  @IsArray()
  @Type(() => MatchChoiceDto)
  choices: MatchChoiceDto[];
}

export class MatchChoiceDto {
  @IsString()
  selectedOptionId: string;

  @IsString({
    each: true,
  })
  allOptionsIds: string[];
}
