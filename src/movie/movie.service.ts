import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { PaginatedListDto } from '../common/list/paginated-list.dto';
import { MovieRepository } from './movie.repository';
import { Movie } from './movie.entity';
import { GetMoviesFilteredDto } from './dto/get-movies-filtered.dto';
import { CreateMovieDto } from './dto/create-movie.dto';
import { MovieCategoryService } from '../movie-category/movie-category.service';
import { UpdateMovieDto } from './dto/update-movie.dto';

@Injectable()
export class MovieService {
  constructor(
    private movieCategoryService: MovieCategoryService,

    @InjectRepository(MovieRepository)
    private movieRepository: MovieRepository,
  ) {}

  async getMoviesList(
    filter: GetMoviesFilteredDto,
  ): Promise<PaginatedListDto<Movie>> {
    return this.movieRepository.getMoviesList(filter);
  }

  async getMovieByName(name: string): Promise<Movie> {
    return await this.movieRepository.getMovieByName(name);
  }

  async getMovieById(id: number): Promise<Movie> {
    const movie = await this.movieRepository.getMovieById(id);

    if (!movie) {
      throw new NotFoundException('Movie not found');
    }

    return movie;
  }

  async createMovie(
    createMovieDto: CreateMovieDto,
    transactionalEntityManager: EntityManager,
  ): Promise<Movie> {
    const { name, categoryIds } = createMovieDto;

    const existingMovie = await this.getMovieByName(name);

    if (existingMovie) {
      throw new BadRequestException('Movie already exists');
    }

    const movie = new Movie(name);

    movie.movieCategories = [];

    for (const categoryId of categoryIds) {
      const movieCategory =
        await this.movieCategoryService.getMovieCategoryById(categoryId);

      movie.movieCategories.push(movieCategory);
    }

    await transactionalEntityManager.save(movie);

    return movie;
  }

  async updateMovie(
    id: number,
    updateMovieDto: UpdateMovieDto,
    transactionalEntityManager: EntityManager,
  ): Promise<Movie> {
    const { name, categoryIds } = updateMovieDto;

    const movie = await this.getMovieById(id);

    movie.name = name;

    movie.movieCategories = [];

    for (const categoryId of categoryIds) {
      const movieCategory =
        await this.movieCategoryService.getMovieCategoryById(categoryId);

      movie.movieCategories.push(movieCategory);
    }

    await transactionalEntityManager.save(movie);

    return movie;
  }

  async deleteMovie(
    id: number,
    transactionalEntityManager: EntityManager,
  ): Promise<void> {
    const movie = await this.getMovieById(id);

    await transactionalEntityManager.softRemove(movie);
  }
}
