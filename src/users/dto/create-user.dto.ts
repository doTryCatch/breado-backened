import { IsNotEmpty, IsString, MinLength, Matches } from 'class-validator';

export class user {
  @IsString()
  @IsNotEmpty()
  name: string;
  @IsString()
  @IsNotEmpty()
  role: string;
  @IsNotEmpty()
  @MinLength(4)
  password: string;
  @IsString()
  @IsNotEmpty()
  @Matches(/^[0-9]{10}$/, {
    message: 'Mobile number must be a valid 10-digit number',
  })
  mobile_number: string;
}
