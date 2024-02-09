import { IsString, MaxLength } from 'class-validator';

export class ConfirmationCodeValidationDto {
  @IsString()
  @MaxLength(255)
  code: string;
}
