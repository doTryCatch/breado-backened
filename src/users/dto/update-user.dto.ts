import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class update_user {
  @IsString()
  @IsNotEmpty()
  name: string;
  @IsString()
  @IsNotEmpty()
  role: string;
  @IsNotEmpty()
  @MinLength(4)
  password: string;
}
