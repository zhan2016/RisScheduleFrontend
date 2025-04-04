import { HttpClient, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { BaseApiService } from './base-api.service';

export interface User {
  id: string;
  username: string;
  role: string;
  permissions: string[];
  // 其他用户属性...
}

export interface LoginResponse {
  token: string;
  user: User;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService extends BaseApiService {
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.hasValidToken());
  isAuthenticated$ = this.isAuthenticatedSubject.asObservable();
  private currentUser: User | null = null;
  private readonly tokenKey = 'auth_token';
  private readonly userKey = 'current_user';

  constructor(
    protected override http: HttpClient,
    private router: Router
  ) {
    super(http);
    this.restoreUserSession();
  }

  private restoreUserSession(): void {
    try {
      // 获取存储的token和用户信息
      const token = localStorage.getItem(this.tokenKey);
      const savedUser = localStorage.getItem(this.userKey);

      // 如果token或用户信息任一不存在，则清除会话
      if (!token || !savedUser) {
        this.clearSession();
        return;
      }

      // 尝试解析用户信息
      const parsedUser = JSON.parse(savedUser) as User;

      // 验证用户对象的完整性
      if (!this.isValidUserObject(parsedUser)) {
        this.clearSession();
        return;
      }

      // 可以在这里添加token的验证逻辑
      if (!this.isValidToken(token)) {
        this.clearSession();
        return;
      }

      // 都验证通过，恢复会话
      this.currentUser = parsedUser;
      this.isAuthenticatedSubject.next(true);

    } catch (e) {
      console.error('Error restoring user session:', e);
      this.clearSession();
    }
  }

  private isValidUserObject(user: any): boolean {
    // 验证用户对象是否包含所需的所有必要属性
    return !!(
      user &&
      typeof user.id === 'string' &&
      typeof user.username === 'string' &&
      typeof user.role === 'string' &&
      Array.isArray(user.permissions)
    );
  }

  private isValidToken(token: string): boolean {
    // 这里可以添加更复杂的token验证逻辑
    // 例如检查JWT的格式、过期时间等
    try {
      // 基本的JWT格式验证
      const parts = token.split('.');
      if (parts.length !== 3) {
        return false;
      }

      // 可以解析JWT并检查过期时间
      const payload = JSON.parse(atob(parts[1]));
      const exp = payload.exp;
      if (exp) {
        return Date.now() < exp * 1000;
      }

      return true;
    } catch (e) {
      console.error('Token validation error:', e);
      return false;
    }
  }

  private clearSession(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
    this.currentUser = null;
    this.isAuthenticatedSubject.next(false);
  }
  private hasValidToken(): boolean {
    const token = localStorage.getItem('token');
    // 这里可以添加token有效性检查的逻辑
    return !!token;
  }
  login(username: string, passwordHash: string): Observable<LoginResponse> {
    return this.http.post<{ token: string; user: User }>('api/auth/login', { username, passwordHash, timestamp: Math.floor(Date.now() / 1000) })
      .pipe(
        tap(response => {
          this.setSession(response);
          this.isAuthenticatedSubject.next(true);
        })
      );
  }

  private setSession(authResult: { token: string; user: User }): void {
    localStorage.setItem(this.tokenKey, authResult.token);
    localStorage.setItem(this.userKey, JSON.stringify(authResult.user));
    this.currentUser = authResult.user;
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
    this.currentUser = null;
    this.router.navigate(['/login']);
    this.isAuthenticatedSubject.next(false);
  }

  getCurrentUser(): User | null {
    return this.currentUser;
  }

  isLoggedIn(): boolean {
    return !!this.currentUser && !!this.getToken();
  }

  isAdmin(): boolean {
    return this.currentUser?.role === 'ADMIN';
  }

  hasPermission(permission: string): boolean {
    return this.currentUser?.permissions?.includes(permission) || false;
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

}
