import { IsString, MaxLength } from 'class-validator';

export class ConfirmRegistrationDto {
  @IsString()
  @MaxLength(255)
  code: string;
}
