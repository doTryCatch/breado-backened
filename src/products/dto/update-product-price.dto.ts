import { IsOptional, Min, IsNumber } from 'class-validator';

export class updateProducPricetDto {
  @IsOptional()
  @IsNumber()
  @Min(1, { message: 'Price must be a greate than zero!' })
  price: number;
}
