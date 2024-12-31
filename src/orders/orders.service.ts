import { Injectable, InternalServerErrorException } from '@nestjs/common';
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

      if (isTodayOrderPlaced) {
        return {
          success: false,
          message: 'An order has already been placed today by this user',
        };
      }

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
          throw new InternalServerErrorException(
            `Product with ID ${product.productId} not found`,
          );
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
      console.error(error);
      throw new InternalServerErrorException(
        'An error occurred while creating the order',
      );
    }
  }

  async updateOrder(
    orderDto: UpdateOrderDto,
  ): Promise<{ success: boolean; message: string }> {
    try {
      const order = await this.prisma.order.findUnique({
        where: { order_id: orderDto.orderId },
      });

      if (!order) {
        return {
          success: false,
          message: 'internal server error: Order not found',
        };
      }

      if (order.remaining < orderDto.depositAmount) {
        return {
          success: false,
          message: 'Deposit amount exceeds the remaining balance',
        };
      }

      await this.prisma.order.update({
        where: { order_id: orderDto.orderId },
        data: {
          deposit: orderDto.depositAmount,
          remaining: { decrement: orderDto.depositAmount },
        },
      });

      return { success: true, message: 'Amount deposited successfully' };
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(
        'An error occurred while updating the order',
      );
    }
  }
}
