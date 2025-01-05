import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AssignmentHistoryDTO, BatchAssignDTO, ReCallDTO, ReportAssignmentDTO, ReportAssignmentQueryDTO } from '../models/report-assignment';
import * as saveAs from 'file-saver';

@Injectable({
  providedIn: 'root'
})
export class ReportAssignmentService {

  private baseUrl = 'api/reportAssignment';

  constructor(private http: HttpClient) { }

  getAssignments(query: ReportAssignmentQueryDTO): Observable<ReportAssignmentDTO[]> {
    // let params = new HttpParams();
    
    // // 构建查询参数
    // Object.keys(query).forEach(key => {
    //   const value = (query as any)[key];
    //   if (value !== null && value !== undefined && value !== '') {
    //     if (value instanceof Date) {
    //       params = params.set(key, value.toISOString());
    //     } else {
    //       params = params.set(key, value.toString());
    //     }
    //   }
    // });

    return this.http.post<ReportAssignmentDTO[]>(this.baseUrl, query);
  }

  transferAssignments(dto: BatchAssignDTO): Observable<any> {
    return this.http.post(`${this.baseUrl}/transfer`, dto);
  }

  recallAssignments(recallDtas: ReCallDTO[]): Observable<any> {
    console.log(recallDtas);
    return this.http.post(`${this.baseUrl}/recall`, recallDtas);
  }

  exportAssignments(query: ReportAssignmentQueryDTO): void {
    let params = new HttpParams();
    
    Object.keys(query).forEach(key => {
      const value = (query as any)[key];
      if (value !== null && value !== undefined && value !== '') {
        if (value instanceof Date) {
          params = params.set(key, value.toISOString());
        } else {
          params = params.set(key, value.toString());
        }
      }
    });

    this.http.get(`${this.baseUrl}/export`, {
      params,
      responseType: 'blob'
    }).subscribe(blob => {
      saveAs(blob, `报告分配记录_${new Date().getTime()}.xlsx`);
    });
  }

  // 获取医生排班信息，用于转发时选择
  getDoctorSchedules(date: Date): Observable<any[]> {
    const params = new HttpParams().set('date', date.toISOString());
    return this.http.get<any[]>(`${this.baseUrl}/doctorSchedules`, { params });
  }
  getAssignmentHistory(risNo: string): Observable<AssignmentHistoryDTO[]> {
    return this.http.get<AssignmentHistoryDTO[]>(`${this.baseUrl}/${risNo}/history`);
  }
  
  // 查询分配异常的报告
  getErrorAssignments(query: ReportAssignmentQueryDTO): Observable<ReportAssignmentDTO[]> {
    return this.http.get<ReportAssignmentDTO[]>(`${this.baseUrl}/errors`, { params: this.buildParams(query) });
  }
  private buildParams(query: any): HttpParams {
    let params = new HttpParams();
    Object.keys(query).forEach(key => {
      const value = query[key];
      if (value !== null && value !== undefined && value !== '') {
        if (value instanceof Date) {
          params = params.set(key, value.toISOString());
        } else {
          params = params.set(key, value.toString());
        }
      }
    });
    return params;
  }
  retryAssignments(lastLogIds: string[]): Observable<any> {
    return this.http.post(`${this.baseUrl}/retry`, { assignmentIds: lastLogIds });
  }
}
