import { EntityRepository, Repository } from 'typeorm';
import { InternalServerErrorException } from '@nestjs/common';
import { PaginatedListDto } from '../common/list/paginated-list.dto';
import { getFilteredPaginatedList } from '../common/list/list-query.helper';
import { Movie } from './movie.entity';
import { GetMoviesFilteredDto } from './dto/get-movies-filtered.dto';

@EntityRepository(Movie)
export class MovieRepository extends Repository<Movie> {
  async getMovieByName(name: string): Promise<Movie> {
    const query = this.createQueryBuilder('movie');
    query.leftJoinAndSelect('movie.movieCategories', 'movieCategories');

    query.andWhere('movie.name = :name', {
      name,
    });

    try {
      return await query.getOne();
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async getMovieById(id: number): Promise<Movie> {
    const query = this.createQueryBuilder('movie');
    query.leftJoinAndSelect('movie.movieCategories', 'movieCategories');

    query.andWhere('movie.id = :id', {
      id,
    });

    try {
      return await query.getOne();
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async getMoviesList(
    filter: GetMoviesFilteredDto,
  ): Promise<PaginatedListDto<Movie>> {
    const { movieCategoryIds } = filter;

    const query = this.createQueryBuilder('movies');
    query.leftJoinAndSelect('movies.movieCategories', 'movies');

    try {
      return await getFilteredPaginatedList(
        query,
        filter,
        ['movies.name'],
        ['movies.name'],
      );
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }
}
