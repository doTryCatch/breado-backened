import { IsString, IsNotEmpty, IsEmail, MinLength } from 'class-validator';

export class signUpDto {
  @IsString()
  @IsNotEmpty()
  name: string;
  @IsEmail()
  phone: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password: string;
}
