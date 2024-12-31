import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UnauthorizedException } from '@nestjs/common';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Retrieve roles metadata from the route
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!roles) {
      return true; // No roles required for the route
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user; // Assumes the user object is added to the request by another guard (like JWT Guard)

    if (!user) {
      throw new UnauthorizedException('User is not authenticated');
    }

    // Check if the user's role matches any of the allowed roles
    const hasRole = roles.some((role) => user.role === role);
    if (!hasRole) {
      throw new UnauthorizedException('User does not have the required role');
    }

    return true;
  }
}
