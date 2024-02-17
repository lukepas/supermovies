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
import { MovieCategoryService } from './movie-category.service';
import { MovieCategory } from './movie-category.entity';
import { CreateMovieCategoryDto } from './dto/create-movie-category.dto';
import { UpdateMovieCategoryDto } from './dto/update-movie-category.dto';

@Controller('movie-categories')
export class MovieCategoryController {
  constructor(
    private movieCategoryService: MovieCategoryService,

    private connection: Connection,
  ) {}

  @Get('/all')
  getAllMovieCategories(): Promise<Array<MovieCategory>> {
    return this.movieCategoryService.getAllMovieCategories();
  }

  @Post()
  @UsePipes(ValidationPipe)
  async createMovieCategory(
    @Body() createMovieCategoryDto: CreateMovieCategoryDto,
  ): Promise<MovieCategory> {
    return await this.connection.transaction((transactionalEntityManager) => {
      try {
        return this.movieCategoryService.createMovieCategory(
          createMovieCategoryDto,
          transactionalEntityManager,
        );
      } catch (e) {}
    });
  }

  @Patch('/:id')
  @UsePipes(ValidationPipe)
  async updateMovieCategory(
    @Param('id', new ParseValidatedIntPipe()) id: number,
    @Body() updateMovieCategoryDto: UpdateMovieCategoryDto,
  ): Promise<MovieCategory> {
    return await this.connection.transaction((transactionalEntityManager) => {
      try {
        return this.movieCategoryService.updateMovieCategory(
          id,
          updateMovieCategoryDto,
          transactionalEntityManager,
        );
      } catch (e) {}
    });
  }

  @Delete('/:id')
  async deleteMovieCategory(
    @Param('id', new ParseValidatedIntPipe()) id: number,
  ): Promise<void> {
    await this.connection.transaction((transactionalEntityManager) => {
      try {
        return this.movieCategoryService.deleteMovieCategory(
          id,
          transactionalEntityManager,
        );
      } catch (e) {}
    });
  }
}
