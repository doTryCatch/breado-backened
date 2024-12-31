import {
  Controller,
  Get,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { RecordsService } from './records.service';
import { JwtAuthGuard } from 'src/comman/guards/auth.guard';
import { RolesGuard } from 'src/comman/guards/role.guard';
import { Roles } from 'src/comman/guards/role.decorator';

@Controller('records')
export class RecordsController {
  constructor(private recordsService: RecordsService) {}
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('manager', 'seller')
  @Get('getRecord')
  async getRecord(@Req() req) {
    const user: { id: number; role: string } = {
      id: req.user.user_id,
      role: req.user.role,
    };
    if (!user.id) {
      throw new UnauthorizedException('User not authenticated');
    }

    return this.recordsService.getRecord(user);
  }
  //get all sellers name with their id
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('manager')
  @Get('getSellers')
  async getSellersList(): Promise<{ user_id: number; name: string }[]> {
    return this.recordsService.getSellers();
  }

  //get all products name with their id and price
  @Get('getProducts')
  async getProductsList(): Promise<any> {
    return this.recordsService.getProducts();
  }
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('manager')
  @Get('getOrderStat')

  //get record of orders with their calculation of per day in total
  async getAllOrderStat(): Promise<any> {
    return this.recordsService.getOrderStat();
  }
}
