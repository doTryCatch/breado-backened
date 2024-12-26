import { IsNotEmpty, IsString, Matches } from 'class-validator';

export class delete_user {
  @IsString()
  @IsNotEmpty()
  @Matches(/^[0-9]{10}$/, {
    message: 'Mobile number must be a valid 10-digit number',
  })
  mobile_number: string;
}
