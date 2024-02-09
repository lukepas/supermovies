import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateProfileDto {
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(60)
  @IsString()
  firstName: string;

  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(60)
  @IsString()
  lastName: string;

  constructor(firstName: string, lastName: string) {
    this.firstName = firstName;
    this.lastName = lastName;
  }
}
