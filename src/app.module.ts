import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { config } from 'dotenv';
import { ProductsModule } from './products/products.module';
import { OrdersModule } from './orders/orders.module';
import { RecordsModule } from './records/records.module';
config();
@Module({
  imports: [
    UsersModule,
    JwtModule.register({
      global: true,
      secret: 'hackifyoucan',

      signOptions: { expiresIn: '5m' },
    }),
    PrismaModule,
    AuthModule,
    ProductsModule,
    OrdersModule,
    RecordsModule,
  ],
})
export class AppModule {}
