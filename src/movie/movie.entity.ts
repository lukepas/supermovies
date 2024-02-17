import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  JoinColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { MovieCategory } from '../movie-category/movie-category.entity';

@Entity()
export class Movie extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToMany(() => MovieCategory, (movieCategory) => movieCategory.movies, {
    eager: false,
  })
  @JoinColumn()
  @JoinTable({ name: 'movie_category' })
  movieCategories: Array<MovieCategory>;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt?: Date;

  constructor(name: string) {
    super();
    this.name = name;
  }
}
