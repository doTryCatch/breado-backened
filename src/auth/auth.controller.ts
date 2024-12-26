import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { loginDto, signUpDto } from './dto';
import { JwtAuthGuard } from 'src/comman/guards/jwt-auth.guard';
import { JwtService } from '@nestjs/jwt';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private jwtService: JwtService,
  ) {}
  @Post('login')
  async handleLogin(@Body() loginCredential: loginDto, @Res() res: Response) {
    const user = await this.authService.login(loginCredential);
    console.log('user login request receive');
    if (user) {
      //create jwt token
      const payload = {
        id: user.user_id,
        username: user.name,
        email: user.email,
      };
      const token = this.jwtService.sign(payload);

      //save into cookies
      res.cookie('jwt', token, {
        httpOnly: true, // Helps prevent XSS attacks
        maxAge: 1000 * 60 * 60, // Cookie will last for 10 years (in milliseconds)
        secure: process.env.NODE_ENV === 'production', // Set to true in production for secure cookies
        sameSite: 'strict', // Helps prevent CSRF attacks
      });

      // Respond with a success message and token (if needed)
      return res.json({ success: true, message: 'Login successful' });
    }
    // return this.authService.login(loginCredential);
    return res.json({ message: 'invalid way to login ' });
  }

  @UseGuards(JwtAuthGuard)
  @Get('getProfile')
  async getProfile(@Req() req, @Res() res: Response) {
    console.log(req.user);
    return res.json(req.user);
  }
  @Post('signup')
  async handleSignup(
    @Body() signUpCredentials: signUpDto,
    @Res() res: Response,
  ) {
    const response = await this.authService.signUp(signUpCredentials);
    if (response.success)
      return res.json({ success: true, message: response.message });
    return res.json({ success: false, message: response.message });
  }
}
