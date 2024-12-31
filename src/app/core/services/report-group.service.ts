import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ReportGroup, ReportGroupQuery } from '../models/exam-mapset';

@Injectable({
  providedIn: 'root'
})
export class ReportGroupService {
  private baseUrl = 'api/reportGroup';
  constructor(private http: HttpClient) { }

  getReportGroups(query: ReportGroupQuery = {}): Observable<ReportGroup[]> {
    let params = new HttpParams();
    if (query.groupName) {
      params = params.set('groupName', query.groupName);
    }
    if (query.groupType) {
      params = params.set('groupType', query.groupType);
    }
    if (query.isActive) {
      params = params.set('isActive', query.isActive);
    }
    if (query.reportType) {
      params = params.set('reportType', query.reportType);
    }
    return this.http.get<ReportGroup[]>(this.baseUrl, { params });
  }

  getReportGroup(id: string): Observable<ReportGroup> {
    return this.http.get<ReportGroup>(`${this.baseUrl}/${id}`);
  }

  createReportGroup(group: ReportGroup): Observable<ReportGroup> {
    return this.http.post<ReportGroup>(this.baseUrl, group);
  }

  updateReportGroup(group: ReportGroup): Observable<ReportGroup> {
    return this.http.put<ReportGroup>(`${this.baseUrl}/${group.groupId}`, group);
  }

  deleteReportGroup(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
