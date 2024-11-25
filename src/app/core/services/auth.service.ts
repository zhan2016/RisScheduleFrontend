import { HttpClient, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

export interface User {
  id: number;
  username: string;
  role: 'ADMIN' | 'USER';
  permissions: string[];
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUser: User | null = null;
  private tokenKey = 'auth_token';
  private userKey = 'current_user';

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    // 从localStorage恢复用户信息
    const savedUser = localStorage.getItem(this.userKey);
    if (savedUser) {
      this.currentUser = JSON.parse(savedUser);
    }
  }

  login(username: string, password: string): Observable<any> {
    return this.http.post<{ token: string; user: User }>('api/auth/login', { username, password })
      .pipe(
        tap(response => {
          localStorage.setItem(this.tokenKey, response.token);
          localStorage.setItem(this.userKey, JSON.stringify(response.user));
          this.currentUser = response.user;
        })
      );
  }

  logout() {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
    this.currentUser = null;
    this.router.navigate(['/login']);
  }

  getCurrentUser(): User | null {
    return this.currentUser;
  }

  isLoggedIn(): boolean {
    return !!this.currentUser;
  }

  isAdmin(): boolean {
    return this.currentUser?.role === 'ADMIN';
  }

  hasPermission(permission: string): boolean {
    return this.currentUser?.permissions.includes(permission) || false;
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  // HTTP请求拦截器，用于添加认证token
  getAuthInterceptor(): HttpInterceptor {
    return {
      intercept: (req: HttpRequest<any>, next: HttpHandler) => {
        const token = this.getToken();
        if (token) {
          const authReq = req.clone({
            headers: req.headers.set('Authorization', `Bearer ${token}`)
          });
          return next.handle(authReq);
        }
        return next.handle(req);
      }
    };
  }
}
