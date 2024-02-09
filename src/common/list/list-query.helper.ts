import { GetListFilterDto } from './get-list-filter.dto';
import { SelectQueryBuilder } from 'typeorm/query-builder/SelectQueryBuilder';
import { PaginatedListDto } from './paginated-list.dto';
import { BadRequestException } from '@nestjs/common';
import { Brackets } from 'typeorm';

export const getFilteredPaginatedList = async <T>(
  query: SelectQueryBuilder<T>,
  filterDto: GetListFilterDto,
  searchFields: string[],
  sortableFields: string[],
) => {
  const { search, sortBy, sortDirection, page, limit } = filterDto;

  if (search) {
    query.andWhere(
      new Brackets((qb) => {
        searchFields.forEach((searchField) =>
          qb.orWhere(`(lower(${searchField}) LIKE lower(:search))`, {
            search: `%${search}%`,
          }),
        );
      }),
    );
  }

  if (sortBy && sortDirection) {
    if (!sortableFields.find((sortableField) => sortableField === sortBy)) {
      throw new BadRequestException('VALIDATION.SORT_BY_NOT_ALLOWED');
    }

    query.addOrderBy(`${sortBy}`, sortDirection);
  }

  const total = await query.getCount();

  if (page && limit) {
    query.skip(page * limit);
    query.take(limit);
  }

  return new PaginatedListDto(await query.getMany(), total);
};
