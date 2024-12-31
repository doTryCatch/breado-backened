import { IsInt, IsNotEmpty, IsString, Min } from 'class-validator';
export class addExpenseDto {
  @IsString()
  @IsNotEmpty()
  name: string;
  @IsInt()
  @Min(1)
  amount: number;
}
