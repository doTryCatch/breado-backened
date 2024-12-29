import { Body, Controller, Delete, Post } from '@nestjs/common';
import { ProductsService } from './products.service';
import {
  createProductDto,
  deleteProductDto,
  updateProducPricetDto,
} from './dto';
@Controller('product')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}
  @Post('add')
  async addProduct(@Body() product: createProductDto): Promise<{
    success: boolean;
    message: string;
  }> {
    return this.productsService.addProduct(product);
  }

  @Post('update')
  async updateProductPrice(
    @Body() updateDto: { id: number; data: updateProducPricetDto },
  ): Promise<{ success: boolean; message: string }> {
    const { id, data } = updateDto;
    return this.productsService.updateProductPrice(id, data);
  }

  @Delete('delete')
  async deleteProduct(@Body() productDto: deleteProductDto): Promise<{
    success: boolean;
    message: string;
  }> {
    return this.productsService.deleteProduct(productDto);
  }
}
