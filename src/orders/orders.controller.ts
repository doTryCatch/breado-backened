import { Body, Controller, Post } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersDto, UpdateOrderDto } from './dto';

@Controller('orders')
export class OrdersController {
  constructor(private orderService: OrdersService) {}
  @Post('create')
  async createOrder(
    @Body() orderDto: OrdersDto,
  ): Promise<{ success: boolean; message: string }> {
    return this.orderService.createOrder(orderDto);
  }
  @Post('paymentDeposit')
  async depositePayment(
    @Body() orderUpdateDto: UpdateOrderDto,
  ): Promise<{ success: boolean; message: string }> {
    return this.orderService.updateOrder(orderUpdateDto);
  }
}
