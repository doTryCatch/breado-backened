import { Body, Controller, Post } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersDto } from './dto';

@Controller('orders')
export class OrdersController {
  constructor(private orderService: OrdersService) {}
  @Post()
  async createOrder(
    @Body() orderDto: OrdersDto,
  ): Promise<{ success: boolean; message: string }> {
    return this.orderService.createOrder(orderDto);
  }
}
