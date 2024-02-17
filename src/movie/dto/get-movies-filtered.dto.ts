import { IsEnum, IsOptional } from 'class-validator';
import { Role } from '../../role/role.enum';
import { GetListFilterDto } from '../../common/list/get-list-filter.dto';
import { Transform } from 'class-transformer';

export class GetMoviesFilteredDto extends GetListFilterDto {
  @IsOptional()
  @Transform((type) => Number(type))
  movieCategoryIds: Array<number>;
}
