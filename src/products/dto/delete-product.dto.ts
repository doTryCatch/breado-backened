import { IsNotEmpty, IsNumber } from 'class-validator';

export class deleteProductDto {
  @IsNotEmpty()
  @IsNumber()
  id: number;
}
