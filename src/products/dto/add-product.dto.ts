import { Min, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class createProductDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(1, { message: 'Price must be greater than zero' })
  price: number;

  @IsNotEmpty()
  @IsString()
  category: string;

  @IsNotEmpty()
  @IsString()
  description: string;
}
