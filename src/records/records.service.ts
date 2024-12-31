import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  ExpenseGroupedByDateDto,
  ExpenseGroupedByNameDto,
  TotalExpenseDto,
} from './dto/expense.dto';

@Injectable()
export class RecordsService {
  constructor(private prisma: PrismaService) {}

  async getRecord(user: { id: number; role: string }): Promise<any> {
    try {
      if (user.role === 'seller') {
        // Fetch records only for the seller
        const sellerRecords = await this.prisma.order.findMany({
          where: {
            user_id: user.id,
          },
          include: {
            user: {
              select: {
                name: true,
              },
            },
            orderItems: {
              include: {
                product: {
                  select: { name: true },
                },
              },
            },
          },
          orderBy: [{ created_at: 'desc' }],
        });
        const formattedData = sellerRecords.map((order) => {
          // Extract the date part from `created_at`
          const date = order.created_at.toISOString().split('T')[0];

          return {
            date,
            order: [
              {
                sellerId: order.user_id,
                sellerName: order.user.name,
                totalOrderCost: order.total_price,
                paidAmountForOrder: order.deposit,
                products: order.orderItems.map((item) => ({
                  name: item.product.name,
                  quantity: item.quantity,
                  totalPrice: item.total_price,
                })),
              },
            ],
          };
        });

        return {
          success: true,
          data: formattedData,
        };
      } else if (user.role === 'manager') {
        // Fetch all records across all sellers
        console.log('fetched by manager');
        const allRecords = await this.prisma.order.findMany({
          include: {
            user: {
              select: {
                name: true,
              },
            },
            orderItems: {
              include: {
                product: {
                  select: { name: true },
                },
              },
            },
          },
          orderBy: [{ created_at: 'desc' }],
        });

        const formattedData = allRecords.reduce((result, order) => {
          const date = order.created_at.toISOString().split('T')[0];
          let dataEntry = result.find((res) => res.date == date);
          if (!dataEntry) {
            dataEntry = { date, order: [] };
            result.push(dataEntry);
          }
          dataEntry.order.push({
            sellerId: order.user_id,
            orderId: order.order_id,
            sellerName: order.user.name,
            totalOrderCost: order.total_price,
            paidAmountForOrder: order.deposit,
            products: order.orderItems.map((item) => ({
              name: item.product.name,
              quantity: item.quantity,
              totalPrice: item.total_price,
            })),
          });

          return result;
        }, []);

        return {
          success: true,
          data: formattedData,
        };
      } else {
        throw new UnauthorizedException('Invalid role');
      }
    } catch (error) {
      throw new UnauthorizedException('Failed to load Record : ' + error);
    }
  }
  async getSellers(): Promise<{ user_id: number; name: string }[]> {
    try {
      const response = await this.prisma.user.findMany({
        where: { role: 'seller' }, // Filter users with the role 'seller'
        select: {
          user_id: true,
          name: true,
        },
      });
      return response;
    } catch (error) {
      throw new UnauthorizedException('failed fetching sellers data :' + error);
    }
  }
  async getProducts(): Promise<any> {
    try {
      const response = await this.prisma.product.findMany({
        select: {
          product_id: true,
          name: true,
          price: true,
          category: true,
          description: true,
        },
      });
      return response;
    } catch (error) {
      throw new UnauthorizedException(
        'failed fetching products data :' + error,
      );
    }
  }
  async getOrderStat(): Promise<any> {
    try {
      const response = await this.prisma.order.findMany({
        select: {
          order_id: true,
          total_price: true,
          deposit: true,
          remaining: true,
          created_at: true,
        },
      });

      // Group orders by date (ignoring time)
      const groupedRecords: { [date: string]: any } = {};

      response.forEach((order) => {
        const date = order.created_at.toISOString().split('T')[0]; // Extract date part (yyyy-mm-dd)

        if (!groupedRecords[date]) {
          groupedRecords[date] = {
            totalPrice: 0,
            totalDeposit: 0,
            totalRemaining: 0,
          };
        }

        // Update totals for each date
        groupedRecords[date].totalPrice += order.total_price;
        groupedRecords[date].totalDeposit += order.deposit;
        groupedRecords[date].totalRemaining += order.remaining;
      });

      // Convert groupedRecords into an array and sort by date
      const result = Object.keys(groupedRecords).map((date) => ({
        date,
        totalPrice: groupedRecords[date].totalPrice,
        totalDeposit: groupedRecords[date].totalDeposit,
        totalRemaining: groupedRecords[date].totalRemaining,
      }));

      // Sort the result by date (most recent first)
      result.sort((a, b) => (a.date > b.date ? -1 : 1));

      return result;
    } catch (error) {
      throw new UnauthorizedException('failed fetching order stats:' + error);
    }
  }
  // Group by Date with error handling and correct return structure
  async getExpensesGroupedByDate(): Promise<ExpenseGroupedByDateDto[]> {
    try {
      const groupedData = await this.prisma.expense.groupBy({
        by: ['createdAt'],
        _sum: {
          amount: true, // Total amount spent on each date
        },
        orderBy: {
          createdAt: 'desc', // Sort by date descending
        },
      });

      return groupedData.map((item) => ({
        date: item.createdAt,
        amount: item._sum.amount,
      }));
    } catch (error) {
      throw new UnauthorizedException(
        'Failed to fetch expenses grouped by date' + error,
      );
    }
  }

  // Group by Name with error handling and correct return structure
  async getExpensesGroupedByName(): Promise<ExpenseGroupedByNameDto[]> {
    try {
      const groupedData = await this.prisma.expense.groupBy({
        by: ['name'],
        _sum: {
          amount: true, // Total amount spent on each name
        },
        orderBy: {
          _sum: {
            amount: 'desc', // Sort by total amount descending
          },
        },
      });
      const result = groupedData.map((item) => ({
        name: item.name,
        amount: item._sum.amount,
      }));
      return result;
    } catch (error) {
      throw new UnauthorizedException(
        'Failed to fetch expenses grouped by name' + error,
      );
    }
  }

  // Group by Total Expense Till Date with error handling and correct return structure
  async getTotalExpenseTillDate(): Promise<TotalExpenseDto> {
    try {
      const totalExpense = await this.prisma.expense.aggregate({
        _sum: {
          amount: true, // Sum of all expenses till date
        },
      });
      return {
        totalExpense: totalExpense._sum.amount,
      };
    } catch (error) {
      throw new UnauthorizedException(
        'Failed to fetch total expense till date' + error,
      );
    }
  }
}
