import {
  IsEnum,
  IsNumberString,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { SortDirection } from './sort-direction.enum';

export class GetListFilterDto {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  search: string;

  @IsOptional()
  @IsString()
  sortBy: string;

  @IsOptional()
  @IsString()
  @IsEnum(SortDirection)
  sortDirection: SortDirection;

  @IsOptional()
  @IsNumberString()
  page: number;

  @IsOptional()
  @IsNumberString()
  limit: number;
}
