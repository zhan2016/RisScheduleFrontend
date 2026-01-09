import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserLeaveRequest, UserLeaveRequestQuery, CreateLeaveRequest } from '../models/user-leave-request';

@Injectable({
  providedIn: 'root'
})
export class UserLeaveRequestService {
  private apiUrl = '/api/UserLeaveRequest';

  constructor(private http: HttpClient) { }

  getLeaveRequests(query: UserLeaveRequestQuery): Observable<any> {
    let params = new HttpParams()
      .set('pageIndex', query.pageIndex.toString())
      .set('pageSize', query.pageSize.toString());

    if (query.applicantId) params = params.set('applicantId', query.applicantId);
    if (query.applicantName) params = params.set('applicantName', query.applicantName);
    if (query.startDate) params = params.set('startDate', query.startDate);
    if (query.endDate) params = params.set('endDate', query.endDate);
    if (query.leaveType) params = params.set('leaveType', query.leaveType);
    if (query.status) params = params.set('status', query.status);
    if (query.isFullDay !== undefined && query.isFullDay !== null) {
      params = params.set('isFullDay', query.isFullDay.toString());
    }

    return this.http.get<any>(this.apiUrl, { params });
  }

  getLeaveRequestById(serialNo: string): Observable<UserLeaveRequest> {
    return this.http.get<UserLeaveRequest>(`${this.apiUrl}/${serialNo}`);
  }

  createLeaveRequest(dto: CreateLeaveRequest): Observable<any> {
    return this.http.post<any>(this.apiUrl, dto);
  }

  updateLeaveRequest(serialNo: string, dto: CreateLeaveRequest): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${serialNo}`, dto);
  }

  approveLeaveRequest(data: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/approve`, data);
  }

  deleteLeaveRequest(serialNo: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${serialNo}`);
  }

  checkUserOnLeave(applicantId: string, date: string, time?: string): Observable<any> {
    let url = `${this.apiUrl}/check/${applicantId}/${date}`;
    if (time) {
      url += `?time=${time}`;
    }
    return this.http.get<any>(url);
  }

  getLeaveDuration(serialNo: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/duration/${serialNo}`);
  }
}