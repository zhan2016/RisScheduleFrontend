import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { map, take } from 'rxjs/operators';

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
  ) {
    return this.authService.isAuthenticated$.pipe(
      take(1),
      map(isAuthenticated => {
        //console.log(isAuthenticated);
        if (!isAuthenticated) {
          this.router.navigate(['/login']);
          return false;
        }
        return true;
      })
    );
  }
  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      return this.authService.isAuthenticated$.pipe(
        take(1),
        map(isAuthenticated => {
          if (!isAuthenticated) {
            this.router.navigate(['/login']);
            return false;
          }
          return true;
        })
      );
  }
  
}
