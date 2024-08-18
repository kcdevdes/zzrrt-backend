import { IsOptional, IsString } from 'class-validator';

export class SearchMatchesDto {
  @IsOptional()
  @IsString()
  query?: string;
}
