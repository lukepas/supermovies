import {
  IsString,
  IsNotEmpty,
  IsOptional,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UpdateUserInfoDto {
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(100)
  @IsString()
  firstName: string;

  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(100)
  @IsString()
  lastName: string;

  @IsOptional()
  @MinLength(8)
  @MaxLength(30)
  password: string;
}
