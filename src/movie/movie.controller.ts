import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../role/roles.guard';
import { ParseValidatedIntPipe } from '../common/pipes/parse-validated-int.pipe';
import { Connection } from 'typeorm';
import { PaginatedListDto } from '../common/list/paginated-list.dto';
import { MovieService } from './movie.service';
import { GetMoviesFilteredDto } from './dto/get-movies-filtered.dto';
import { Movie } from './movie.entity';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';

@Controller('movies')
export class MovieController {
  constructor(
    private movieService: MovieService,

    private connection: Connection,
  ) {}

  @Get()
  getMoviesList(
    @Query(ValidationPipe) filterDto: GetMoviesFilteredDto,
  ): Promise<PaginatedListDto<Movie>> {
    return this.movieService.getMoviesList(filterDto);
  }

  @Post()
  @UsePipes(ValidationPipe)
  async createMovie(@Body() createMovieDto: CreateMovieDto): Promise<Movie> {
    return await this.connection.transaction((transactionalEntityManager) => {
      try {
        return this.movieService.createMovie(
          createMovieDto,
          transactionalEntityManager,
        );
      } catch (e) {}
    });
  }

  @Patch('/:id')
  @UsePipes(ValidationPipe)
  async updateMovie(
    @Param('id', new ParseValidatedIntPipe()) id: number,
    @Body() updateMovieDto: UpdateMovieDto,
  ): Promise<Movie> {
    return await this.connection.transaction((transactionalEntityManager) => {
      try {
        return this.movieService.updateMovie(
          id,
          updateMovieDto,
          transactionalEntityManager,
        );
      } catch (e) {}
    });
  }

  @Delete('/:id')
  async deleteMovie(
    @Param('id', new ParseValidatedIntPipe()) id: number,
  ): Promise<void> {
    await this.connection.transaction((transactionalEntityManager) => {
      try {
        return this.movieService.deleteMovie(id, transactionalEntityManager);
      } catch (e) {}
    });
  }
}
