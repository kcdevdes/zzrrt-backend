import { IsArray, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateMatchHistoryDto {
  @IsString()
  @IsOptional()
  userId?: string;

  @IsArray()
  @Type(() => MatchChoiceDto)
  choices: MatchChoiceDto[];
}

export class MatchChoiceDto {
  @IsString()
  selectedOptionId: string;

  @IsArray()
  @Type(() => String)
  allOptionsIds: string[];
}
