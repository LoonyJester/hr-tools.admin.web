import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { AuthService } from '../authorization/services/auth.service';

@Injectable()
export class IsUserHasAdminRoleGuard implements CanActivate {

  constructor(private authService: AuthService) {}

  canActivate() {
    return this.authService.isUserInRole(["Admin"]);
  }
}