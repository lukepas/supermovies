import { IsEnum, IsOptional } from 'class-validator';
import { Role } from '../../role/role.enum';
import { GetListFilterDto } from '../../common/list/get-list-filter.dto';

export class GetUsersFilteredDto extends GetListFilterDto {
  @IsOptional()
  @IsEnum(Role)
  role: Role;
}
