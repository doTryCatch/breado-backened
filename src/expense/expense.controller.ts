import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { addExpenseDto } from './dto';
import { ExpenseService } from './expense.service';
import { JwtAuthGuard } from 'src/comman/guards/auth.guard';
import { RolesGuard } from 'src/comman/guards/role.guard';
import { Roles } from 'src/comman/guards/role.decorator';

@Controller('expense')
export class ExpenseController {
  constructor(private expenseService: ExpenseService) {}
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('manager')
  @Post('add')
  async createExpense(
    @Body() expenseDto: addExpenseDto[],
  ): Promise<{ success: boolean; message: string }> {
    return this.expenseService.addExpenses(expenseDto);
  }
}
