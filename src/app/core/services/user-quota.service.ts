import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { QuotaRequest, UserQuota } from '../models/user-manage';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserQuotaService {
  private apiUrl = 'api/quotas';

  constructor(private http: HttpClient) { }

  // 获取用户配额列表
  getUserQuotas(userId: number): Observable<UserQuota[]> {
    return this.http.get<UserQuota[]>(`${this.apiUrl}/user/${userId}`);
  }
  // 创建配额
  createQuota(quota: any): Observable<any> {
    return this.http.post(this.apiUrl, quota);
  }
   // 删除配额
   deleteQuota(quotaId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${quotaId}`);
  }

  // 配额查询
  getQuota(userId: number): Observable<UserQuota> {
    return this.http.get<UserQuota>(`${this.apiUrl}/${userId}`);
  }

  // 管理员预分配配额
  allocateQuota(quota: UserQuota): Observable<any> {
    return this.http.post(`${this.apiUrl}/allocate`, quota);
  }

  // 更新配额
  updateQuota(quota: UserQuota): Observable<any> {
    return this.http.put(`${this.apiUrl}/${quota.id}`, quota);
  }

  // 授权申请
  submitQuotaRequest(request: QuotaRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/requests`, request);
  }

  // 管理员审核授权申请
  approveQuotaRequest(requestId: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/requests/${requestId}/approve`, {});
  }

  rejectQuotaRequest(requestId: number, reason: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/requests/${requestId}/reject`, { reason });
  }

  // 获取待审核的授权申请列表
  getPendingRequests(): Observable<QuotaRequest[]> {
    return this.http.get<QuotaRequest[]>(`${this.apiUrl}/requests/pending`);
  }

  // 获取用户的授权申请历史
  getUserRequests(userId: number): Observable<QuotaRequest[]> {
    return this.http.get<QuotaRequest[]>(`${this.apiUrl}/requests/user/${userId}`);
  }
}
