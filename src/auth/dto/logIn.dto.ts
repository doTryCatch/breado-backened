import { IsString, IsNotEmpty, Matches } from 'class-validator';

export class loginDto {
  @IsString({ message: 'Mobile number must be a string' })
  @Matches(/^[0-9]{10}$/, {
    message: 'Phone number must be a 10-digit numeric value',
  })
  phone: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
