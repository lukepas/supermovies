import { IsString, MinLength, MaxLength, IsEmail } from 'class-validator';

export class RemindPasswordDto {
  @IsString()
  @MinLength(4)
  @MaxLength(60)
  @IsEmail()
  email: string;
}
