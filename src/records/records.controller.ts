import {
  Controller,
  Get,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { RecordsService } from './records.service';
import { JwtAuthGuard } from 'src/comman/guards/jwt-auth.guard';

@Controller('records')
export class RecordsController {
  constructor(private recordsService: RecordsService) {}
  // @UseGuards(JwtAuthGuard)
  @Get('getRecord')
  async getRecord(@Req() req: Request) {
    const userId = req.headers['userid'];
    if (!userId) {
      throw new UnauthorizedException('User not authenticated');
    }

    return this.recordsService.getRecord(Number(userId));
  }
}
