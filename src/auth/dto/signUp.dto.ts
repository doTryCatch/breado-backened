import { IsString, Matches, IsNotEmpty, MinLength } from 'class-validator';

export class signUpDto {
  @IsString()
  @IsNotEmpty()
  name: string;
  @IsString({ message: 'Mobile number must be a string' })
  @Matches(/^[0-9]{10}$/, {
    message: 'Phone number must be a 10-digit numeric value',
  })
  phone: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password: string;
}
