import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Role } from '../../role/role.enum';

export class CreateUserDto {
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(200)
  @IsEmail()
  email: string;

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
  @MaxLength(100)
  @IsString()
  lastName: string;
}
