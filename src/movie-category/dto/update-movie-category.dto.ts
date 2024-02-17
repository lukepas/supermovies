import { IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class UpdateMovieCategoryDto {
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(100)
  name: string;
}
