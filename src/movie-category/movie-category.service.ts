import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { MovieCategoryRepository } from './movie-category.repository';
import { MovieCategory } from './movie-category.entity';
import { CreateMovieCategoryDto } from './dto/create-movie-category.dto';
import { UpdateMovieCategoryDto } from './dto/update-movie-category.dto';

@Injectable()
export class MovieCategoryService {
  constructor(
    @InjectRepository(MovieCategoryRepository)
    private movieCategoryRepository: MovieCategoryRepository,
  ) {}

  async getAllMovieCategories(): Promise<Array<MovieCategory>> {
    return this.movieCategoryRepository.getAllMovieCategories();
  }

  async getMovieCategoryByName(name: string): Promise<MovieCategory> {
    return await this.movieCategoryRepository.getMovieCategoryByName(name);
  }

  async getMovieCategoryById(id: number): Promise<MovieCategory> {
    return await this.movieCategoryRepository.getMovieCategoryById(id);
  }

  async createMovieCategory(
    createMovieCategory: CreateMovieCategoryDto,
    transactionalEntityManager: EntityManager,
  ): Promise<MovieCategory> {
    const { name } = createMovieCategory;

    const existingMovieCategory = await this.getMovieCategoryByName(name);

    if (existingMovieCategory) {
      throw new BadRequestException('Movie category already exists');
    }

    const movieCategory = new MovieCategory(name);

    movieCategory.movies = [];

    await transactionalEntityManager.save(movieCategory);

    return movieCategory;
  }

  async updateMovieCategory(
    id: number,
    updateMovieCategoryDto: UpdateMovieCategoryDto,
    transactionalEntityManager: EntityManager,
  ): Promise<MovieCategory> {
    const { name } = updateMovieCategoryDto;

    const movieCategory = await this.getMovieCategoryById(id);

    if (!movieCategory) {
      throw new NotFoundException('Movie category not found');
    }

    movieCategory.name = name;

    await transactionalEntityManager.save(movieCategory);

    return movieCategory;
  }

  async deleteMovieCategory(
    id: number,
    transactionalEntityManager: EntityManager,
  ): Promise<void> {
    const movieCategory =
      await this.movieCategoryRepository.getMovieCategoryById(id);

    if (!movieCategory) {
      throw new NotFoundException('Movie category not found');
    }

    await transactionalEntityManager.softRemove(movieCategory);
  }
}
