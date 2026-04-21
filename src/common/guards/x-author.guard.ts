import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { AuthorizedUser } from 'src/domain/entity/authorized-token.entity';

@Injectable()
export class XAuthorGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly jwtService: JwtService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>('isPublic', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest<
      Request & {
        user?: AuthorizedUser;
      }
    >();
    const authorization = request.headers['authorization'];

    if (!authorization || Array.isArray(authorization)) {
      throw new UnauthorizedException('Authorization bearer token is required');
    }

    const [scheme, token] = authorization.split(' ');
    if (scheme !== 'Bearer' || !token) {
      throw new UnauthorizedException(
        'Authorization format must be Bearer <token>',
      );
    }

    try {
      const payload = (await this.jwtService.verifyAsync(token)) as AuthorizedUser;
      request.user = payload;
    } catch {
      throw new UnauthorizedException('Bearer token is invalid or expired');
    }

    return true;
  }
}
