import { IsNotEmpty, IsNumber } from 'class-validator';

export class deleteProductDto {
  @IsNotEmpty()
  @IsNumber()
  product_id: number;
}
