import { IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class CreateMovieCategoryDto {
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(100)
  name: string;
}
