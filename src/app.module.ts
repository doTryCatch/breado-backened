import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { config } from 'dotenv';
import { ProductsModule } from './products/products.module';
import { OrdersModule } from './orders/orders.module';
import { RecordsModule } from './records/records.module';
import { ExpenseModule } from './expense/expense.module';
config();
@Module({
  imports: [
    UsersModule,
    JwtModule.register({
      global: true,
      secret:
        process.env.SECRET_KEY ||
        (() => {
          console.warn('SECRET_KEY not set. Using fallback key.');
          return 'hackifyoucan';
        })(),

      signOptions: { expiresIn: '5m' },
    }),
    PrismaModule,
    AuthModule,
    ProductsModule,
    OrdersModule,
    RecordsModule,
    ExpenseModule,
  ],
})
export class AppModule {}
