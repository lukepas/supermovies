import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from './role.enum';
import { Observable } from 'rxjs';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const roles = this.reflector.get<Role[]>('roles', context.getHandler());

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    return RolesGuard.matchRoles(user.role, roles);
  }

  private static matchRoles(userRole: Role, acceptableRoles?: Role[]): boolean {
    if (userRole === Role.ADMIN) {
      return true;
    }

    return acceptableRoles?.includes(userRole);
  }
}
