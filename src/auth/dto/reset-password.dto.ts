import { IsString, MinLength, MaxLength, IsEmail } from 'class-validator';

export class ResetPasswordDto {
  @IsString()
  @MinLength(4)
  @MaxLength(60)
  @IsEmail({})
  email: string;

  @IsString()
  @MinLength(8)
  @MaxLength(30)
  password: string;

  @IsString()
  @MaxLength(255)
  code: string;
}
