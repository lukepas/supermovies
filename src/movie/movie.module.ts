import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { MovieRepository } from './movie.repository';
import { MovieService } from './movie.service';
import { MovieController } from './movie.controller';
import { MovieCategoryService } from '../movie-category/movie-category.service';
import { MovieCategoryRepository } from '../movie-category/movie-category.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([MovieRepository, MovieCategoryRepository]),
    AuthModule,
  ],
  controllers: [MovieController],
  providers: [MovieService, MovieCategoryService],
  exports: [],
})
export class MovieModule {}
