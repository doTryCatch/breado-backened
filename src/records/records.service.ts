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
            orderItems: true, // Include order items for detailed information
          },
        });

        if (!sellerRecords.length) {
          throw new UnauthorizedException('No records found for the seller');
        }

        return {
          success: true,
          data: sellerRecords,
        };
      } else if (user.role === 'manager') {
        // Fetch all records across all sellers
        console.log('fetched by manager');
        const allRecords = await this.prisma.user.findMany({
          include: {
            order: {
              include: {
                orderItems: true,
              },
            },
          },
        });

        return {
          success: true,
          data: allRecords,
        };
      } else {
        throw new UnauthorizedException('Invalid role');
      }
    } catch (error) {
      throw new UnauthorizedException('Failed to load Record : ' + error);
    }
  }
}
