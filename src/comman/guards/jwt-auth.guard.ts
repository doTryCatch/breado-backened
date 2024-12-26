import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ExecutionContext, CanActivate } from '@nestjs/common';
import { UnauthorizedException } from '@nestjs/common';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.cookies?.jwt;
    if (!token) {
      throw new UnauthorizedException('Token is missing');
    }

    try {
      const payload = await this.jwtService.verifyAsync(token);
      request.user = payload; // Attach the user information to the request
      return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token ' + error);
    }
  }
}
