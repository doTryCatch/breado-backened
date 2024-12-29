import { IsOptional, Min, IsNumber } from 'class-validator';

export class updateProducPricetDto {
  @IsOptional()
  @IsNumber()
  @Min(0, { message: 'Price must be a positive number.' })
  price: number;
}
