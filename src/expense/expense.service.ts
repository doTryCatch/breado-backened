import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { addExpenseDto } from './dto';

@Injectable()
export class ExpenseService {
  constructor(private prisma: PrismaService) {}

  async addExpenses(
    expensesDto: addExpenseDto[],
  ): Promise<{ success: boolean; message: string }> {
    try {
      // Use Prisma's createMany to insert multiple expenses at once
      await this.prisma.expense.createMany({
        data: expensesDto.map(({ name, amount }) => ({
          name: name,
          amount: amount,
        })),
      });
      return { success: true, message: 'Expenses Added Successfully' };
    } catch (error: any) {
      // Handle errors and throw an exception
      throw new UnauthorizedException(
        error.message || 'Failed to add expenses',
      );
    }
  }
}
