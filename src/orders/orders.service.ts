import {
  Injectable,
  UnauthorizedException,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { OrdersDto, UpdateOrderDto } from './dto';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async createOrder(
    orderDto: OrdersDto,
  ): Promise<{ success: boolean; message: string }> {
    try {
      const { userId, products } = orderDto;
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const isTodayOrderPlaced = await this.prisma.order.findFirst({
        where: { user_id: userId, created_at: { gte: today } },
      });
      if (isTodayOrderPlaced)
        return {
          success: false,
          message: 'An Order has been placed already from this seller',
        };

      const productIds = products.map((product) => product.productId);

      const productDetails = await this.prisma.product.findMany({
        where: { product_id: { in: productIds } },
      });

      let totalPrice = 0;

      const orderItemData = products.map((product) => {
        const productDetail = productDetails.find(
          (p) => p.product_id === product.productId,
        );
        if (!productDetail) {
          return {
            success: false,
            message: `Product with ID ${product.productId} not found`,
          };
        }
        const eachItemTotalPrice =
          productDetail.price * product.productQuantity;
        totalPrice += eachItemTotalPrice;

        return {
          product_id: product.productId,
          quantity: product.productQuantity,
          total_price: eachItemTotalPrice,
        };
      });

      await this.prisma.$transaction(async (prisma) => {
        const order = await prisma.order.create({
          data: {
            user_id: userId,
            total_price: totalPrice,
            remaining: totalPrice,
          },
        });

        await prisma.orderItem.createMany({
          data: orderItemData.map((item) => ({
            ...item,
            order_id: order.order_id,
          })),
        });
      });
      return { success: true, message: 'Order created successfully' };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error; // rethrow known exceptions
      }
      throw new InternalServerErrorException(
        'An error occurred while creating the order',
      );
    }
  }
  async updateOrder(
    orderDto: UpdateOrderDto,
  ): Promise<{ success: boolean; message: string }> {
    try {
      await this.prisma.order.update({
        where: { order_id: orderDto.orderId },
        data: {
          deposit: orderDto.depositAmount,
          remaining: { decrement: orderDto.depositAmount },
        },
      });
      return { success: true, message: 'Amount deposited successfully' };
    } catch (error) {
      throw new UnauthorizedException(error);
    }
  }
}
