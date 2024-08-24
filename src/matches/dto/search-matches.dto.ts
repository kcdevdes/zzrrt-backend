import {
  IsArray,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Length,
  Max,
  Min,
} from 'class-validator';

export enum SearchField {
  CREATOR = 'creator',
  TITLE = 'title',
  DESCRIPTION = 'description',
  OPTIONS = 'options',
}

export class SearchMatchesDto {
  @IsString()
  @Length(3, 25, { message: 'Query must be between 3 and 25 characters long' })
  query: string;

  @IsArray()
  @IsEnum(SearchField, { each: true })
  @IsOptional()
  fields: SearchField[] = [];

  @IsInt()
  @Min(1)
  page: number = 1;

  @IsInt()
  @Min(1)
  @Max(100)
  limit: number = 10;
}
