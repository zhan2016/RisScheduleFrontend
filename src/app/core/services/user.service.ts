import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../models/user-manage';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiUrl = 'api/users';

  constructor(private http: HttpClient) { }

  // 获取用户列表
  getUser(): Observable<User[]> {  // 注意这里改为返回数组，匹配 UserListComponent 的调用
    return this.http.get<User[]>(this.apiUrl);
  }

  // 创建用户
  createUser(userData: any): Observable<any> {
    return this.http.post(this.apiUrl, userData);
  }

  // 更新用户
  updateUser(id: number, userData: any): Observable<any> {  // 添加 id 参数
    return this.http.put(`${this.apiUrl}/${id}`, userData);
  }

  // 删除用户
  deleteUser(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  // 更新用户状态
  updateStatus(id: number, status: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/status`, { status });
  }

  // 重置密码
  resetPassword(id: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/${id}/reset-password`, {});
  }
}
