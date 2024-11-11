import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean  {
        const request = context.switchToHttp().getRequest();
        const user = request.user;

        // Check if the user has the admin role or a specific email
        return user && user.email === 'admin@gmail.com';
    }
}