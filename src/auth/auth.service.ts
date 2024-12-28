import { Injectable, UnauthorizedException } from '@nestjs/common';
import { loginDto, signUpDto } from './dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}
  async login(loginCredentials: loginDto): Promise<{
    success: boolean;
    message: string;
    data: { user_id: number; name: string; email: string; role: string };
  }> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { email: loginCredentials.email },
      });

      if (!user)
        return { success: false, message: 'Email is incorrect!', data: null };

      const isPasswordValid = await bcrypt.compare(
        loginCredentials.password,
        user.password,
      );

      if (!isPasswordValid)
        return {
          success: false,
          message: 'Password is incorrect!',
          data: null,
        };

      const { user_id, name, email, role } = user;

      return {
        success: true,
        message: 'Login successful!',
        data: { user_id, name, email, role },
      };
    } catch (error) {
      throw new UnauthorizedException('Unexpected Error: ' + error);
    }
  }
  async signUp(
    signUpCredentials: signUpDto,
  ): Promise<{ message: string; success: boolean }> {
    const { name, email, password } = signUpCredentials;
    const isUserEmailAlreadyExists = await this.prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    if (isUserEmailAlreadyExists)
      return { message: 'Email already exist!', success: false };
    const isUserNameAlreadyExists = await this.prisma.user.findFirst({
      where: {
        name: name,
      },
    });
    if (isUserNameAlreadyExists)
      return { message: 'Username already exist!', success: false };
    const hashPassword = await bcrypt.hash(password, 10);
    try {
      await this.prisma.user.create({
        data: {
          name: name,
          email: email,
          password: hashPassword,
        },
      });

      return { message: 'Account created successfully!!', success: true };
    } catch (error) {
      throw new UnauthorizedException(
        'failed Account Creattion due to Unexpected error ' + error,
      );
    }
  }
}
