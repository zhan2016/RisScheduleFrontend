import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

/*
const routes: Routes = [
  {
    path: 'licenses',
    component: LicenseListComponent,
    canActivate: [AuthGuard],
    data: { permission: 'LICENSE_MANAGE' }
  },
  // ... 其他路由
];
export class SomeComponent {
  constructor(private authService: AuthService) {}

  canCreateLicense(): boolean {
    return this.authService.hasPermission('LICENSE_CREATE');
  }

  canViewAllLicenses(): boolean {
    return this.authService.isAdmin();
  }
}
*/
@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanActivateChild {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | UrlTree {
    if (!this.authService.isLoggedIn()) {
      return this.router.createUrlTree(['/login']);
    }

    const requiredPermission = route.data['permission'] as string;
    if (requiredPermission && !this.authService.hasPermission(requiredPermission)) {
      return this.router.createUrlTree(['/403']);
    }

    return true;
  }
  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return true;
  }
  
}
