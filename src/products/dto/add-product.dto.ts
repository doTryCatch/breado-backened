import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class createProductDto {
  @IsNotEmpty()
  @IsString()
  name: string;
  @IsNotEmpty()
  @IsNumber()
  price: number;
}
