import { IsString, IsNotEmpty, IsEmail } from 'class-validator';

export class signUpDto {
  @IsString()
  @IsNotEmpty()
  name: string;
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
