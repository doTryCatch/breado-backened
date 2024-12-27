import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class RecordsService {
  constructor(private prisma: PrismaService) {}

  async getRecord(userId: number): Promise<any> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { user_id: userId },
      });
      if (user.role === 'seller') {
        // Fetch records only for the seller
        const sellerRecords = await this.prisma.order.findMany({
          where: {
            user_id: userId,
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
            order: {
              userId: order.user_id,
              username: order.user.name,
              totalOrderCost: order.total_price,
              paidAmountForOrder: order.deposit,
              productDetails: order.orderItems.map((item) => ({
                productName: item.product.name,
                quantity: item.quantity,
                totalPriceOfRespectiveProductItem: item.total_price,
              })),
            },
          };
        });

        if (!sellerRecords.length) {
          throw new UnauthorizedException('No records found for the seller');
        }

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
}
