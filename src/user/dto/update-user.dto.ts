import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Role } from '../../role/role.enum';

export class UpdateUserDto {
  @IsNotEmpty()
  @IsEnum(Role)
  role: Role;

  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(100)
  @IsString()
  firstName: string;

  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(200)
  @IsString()
  lastName: string;

  @IsOptional()
  @MinLength(6)
  @MaxLength(100)
  @IsEmail()
  email: string;
}
