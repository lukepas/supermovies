import { EntityRepository, Repository } from 'typeorm';
import { InternalServerErrorException } from '@nestjs/common';
import { MovieCategory } from './movie-category.entity';

@EntityRepository(MovieCategory)
export class MovieCategoryRepository extends Repository<MovieCategory> {
  async getMovieCategoryByName(name: string): Promise<MovieCategory> {
    const query = this.createQueryBuilder('movieCategory');

    query.andWhere('movieCategory.name = :name', {
      name,
    });

    try {
      return await query.getOne();
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async getMovieCategoryById(id: number): Promise<MovieCategory> {
    const query = this.createQueryBuilder('movieCategory');

    query.andWhere('movieCategory.id = :id', {
      id,
    });

    try {
      return await query.getOne();
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async getAllMovieCategories(): Promise<Array<MovieCategory>> {
    const query = this.createQueryBuilder('movieCategories');

    try {
      return await query.getMany();
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }
}
