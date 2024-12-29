import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  createProductDto,
  deleteProductDto,
  updateProducPricetDto,
} from './dto';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async addProduct(product: createProductDto): Promise<{
    success: boolean;
    message: string;
  }> {
    try {
      await this.prisma.product.create({
        data: {
          name: product.name,
          price: product.price,
          category: product.category,
          description: product.description,
        },
      });
      return { success: true, message: 'product added successfully' };
    } catch (err) {
      throw new UnauthorizedException(err);
    }
  }
  async updateProductPrice(
    productId: number,
    updateableData: updateProducPricetDto,
  ): Promise<{ success: boolean; message: string }> {
    try {
      await this.prisma.product.update({
        where: { product_id: productId },
        data: updateableData,
      });

      return { success: true, message: 'product updated successfully' };
    } catch (error) {
      throw new UnauthorizedException(error);
    }
  }
  async deleteProduct(
    productDto: deleteProductDto,
  ): Promise<{ success: boolean; message: string }> {
    try {
      await this.prisma.product.delete({
        where: { product_id: productDto.product_id },
      });
      return { success: true, message: 'product deleted successfully' };
    } catch (error) {
      throw new UnauthorizedException(error);
    }
  }
}
