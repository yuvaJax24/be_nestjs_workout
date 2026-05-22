import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';

interface AuthenticatedRequest extends Request {
  cookies?: Record<string, string>;
  user?: { sub: string };
}

@Injectable()
export class JwtCookieAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const token = request.cookies?.access_token;

    if (!token || !token.startsWith('signed-jwt-for-')) {
      throw new UnauthorizedException('Missing or invalid access token cookie');
    }

    request.user = { sub: token.replace('signed-jwt-for-', '') };
    return true;
  }
}
