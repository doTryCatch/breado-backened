import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersDto, UpdateOrderDto } from './dto';
import { RolesGuard } from 'src/comman/guards/role.guard';
import { JwtAuthGuard } from 'src/comman/guards/auth.guard';
import { Roles } from 'src/comman/guards/role.decorator';

@Controller('orders')
export class OrdersController {
  constructor(private orderService: OrdersService) {}
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('manager', 'seller')
  @Post('create')
  async createOrder(
    @Body() orderDto: OrdersDto,
  ): Promise<{ success: boolean; message: string }> {
    return this.orderService.createOrder(orderDto);
  }
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('manager')
  @Post('paymentDeposit')
  async depositePayment(
    @Body() orderUpdateDto: UpdateOrderDto,
  ): Promise<{ success: boolean; message: string }> {
    return this.orderService.updateOrder(orderUpdateDto);
  }
}
