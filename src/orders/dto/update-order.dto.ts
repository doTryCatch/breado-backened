import { IsInt, IsNumber, Min } from 'class-validator';

export class UpdateOrderDto {
  @IsInt()
  orderId: number;

  @IsNumber()
  @Min(1, { message: 'Deposit amount must be greater than 0' })
  depositAmount: number;
}
