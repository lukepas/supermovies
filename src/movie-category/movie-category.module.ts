import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { MovieCategoryRepository } from './movie-category.repository';
import { MovieCategoryService } from './movie-category.service';
import { MovieCategoryController } from './movie-category.controller';

@Module({
  imports: [TypeOrmModule.forFeature([MovieCategoryRepository]), AuthModule],
  controllers: [MovieCategoryController],
  providers: [MovieCategoryService],
  exports: [],
})
export class MovieCategoryModule {}
