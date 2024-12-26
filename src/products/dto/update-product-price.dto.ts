import { IsOptional, Min, IsString, IsNumber } from 'class-validator';

export class updateProducPricetDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsNumber()
  @Min(0, { message: 'Price must be a positive number.' })
  price?: number;
}
