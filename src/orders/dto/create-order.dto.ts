import { IsInt, IsArray, ValidateNested, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class OrderProductDto {
  @IsInt()
  productId: number;

  @IsInt()
  @Min(0) // Ensure quantity is at least 1
  productQuantity: number;
}

export class OrdersDto {
  @IsInt()
  userId: number;

  @IsArray()
  @ValidateNested({ each: true }) // Validate each product in the array
  @Type(() => OrderProductDto) // Specify the type for transformation
  products: OrderProductDto[];
}
