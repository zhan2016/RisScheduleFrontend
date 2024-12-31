import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ShiftReportGroup, ShiftReportGroupQuery } from '../models/shift-report-group';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ShiftReportGroupService {

  private baseUrl = 'api/ShiftReportGroup';

  constructor(private http: HttpClient) { }

  getList(query: ShiftReportGroupQuery): Observable<ShiftReportGroup[]> {
    let params = new HttpParams();
    if (query.groupId) {
      params = params.set('groupId', query.groupId);
    }
    if (query.shiftTypeId) {
      params = params.set('shiftTypeId', query.shiftTypeId);
    }
    if (query.isActive) {
      params = params.set('isActive', query.isActive);
    }
    return this.http.get<ShiftReportGroup[]>(this.baseUrl, { params });
  }

  getById(id: string): Observable<ShiftReportGroup> {
    return this.http.get<ShiftReportGroup>(`${this.baseUrl}/${id}`);
  }

  create(data: ShiftReportGroup): Observable<ShiftReportGroup> {
    return this.http.post<ShiftReportGroup>(this.baseUrl, data);
  }

  update(id: string, data: ShiftReportGroup): Observable<ShiftReportGroup> {
    return this.http.put<ShiftReportGroup>(`${this.baseUrl}/${id}`, data);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
