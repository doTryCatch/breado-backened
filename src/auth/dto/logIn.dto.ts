import {
  IsString,
  IsNotEmpty,
  IsEmail,
  Matches,
  ValidateIf,
} from 'class-validator';

export class loginDto {
  @ValidateIf((obj) => !obj.email) // Validate mobile if email is not provided
  @IsString({ message: 'Mobile number must be a string' })
  @Matches(/^[0-9]{10}$/, {
    message: 'Phone number must be a 10-digit numeric value',
  })
  mobile?: string;

  @ValidateIf((obj) => !obj.mobile) // Validate email if mobile is not provided
  @IsEmail({}, { message: 'Invalid email format' })
  email?: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
