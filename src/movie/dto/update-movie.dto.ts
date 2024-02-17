import { IsNotEmpty, IsOptional, MaxLength, MinLength } from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdateMovieDto {
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(100)
  name: string;

  @IsNotEmpty()
  @IsOptional()
  @Transform((type) => Number(type))
  categoryIds: Array<number>;
}
