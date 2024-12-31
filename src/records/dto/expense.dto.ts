import { IsDate, IsNumber, IsString } from 'class-validator';

export class ExpenseGroupedByDateDto {
  @IsDate()
  date: Date;

  @IsNumber()
  amount: number;
}

export class ExpenseGroupedByNameDto {
  @IsString()
  name: string;

  @IsNumber()
  amount: number;
}

export class TotalExpenseDto {
  @IsNumber()
  totalExpense: number;
}
