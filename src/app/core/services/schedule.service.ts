// schedule.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ShiftType } from '../models/shift';
import { DoctorSchedule, ScheduleQueryDTO, ScheduleSaveDTO, ScheduleView } from '../models/doctor-shedule';
import { ShiftTypeService } from './shift-type.service';
import { format } from 'date-fns';
import { BaseApiService } from './base-api.service';
import { ApiResponse } from '../interceptors/api-response.interceptor';
import { PageResult } from '../models/page-result';

@Injectable({
  providedIn: 'root'
})
export class ScheduleService extends BaseApiService {
  private baseUrl = '/api/schedule';

  constructor(
    private httpClient: HttpClient,
    private shiftTypeApi: ShiftTypeService
  ) {
    super(httpClient);
  }

  // 获取班种列表
  getShiftTypes(): Observable<ShiftType[]> {
    return this.shiftTypeApi.getShiftTypes({isActive:"1"});
    //return this.http.get<ShiftType[]>(`${this.shiftTypeUrl}/list`);
  }

  // 获取医生列表
  getDoctors(): Observable<any[]> {
    return this.http.get<any[]>('/api/doctor/list');
  }

  // 获取排班列表
  getSchedules(query: ScheduleQueryDTO): Observable<PageResult<ScheduleView[]>> {
    let params = new HttpParams();
    
    // 构建查询参数
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

    return this.http.get<PageResult<ScheduleView[]>>(`${this.baseUrl}/list`, { params });
  }

  // 保存排班
  saveSchedule(schedule: ScheduleSaveDTO): Observable<any> {
    if (schedule.scheduleId) {
      return this.http.put(`${this.baseUrl}/${schedule.scheduleId}`, schedule);
    }
    return this.http.post(this.baseUrl, schedule);
  }

  // 批量保存排班
  batchSaveSchedules(schedules: DoctorSchedule[]): Observable<any> {
    return this.post(`${this.baseUrl}/batch`, schedules);
  }

  // 删除排班
  deleteSchedule(scheduleId: string): Observable<any> {
    return this.delete(`${this.baseUrl}/${scheduleId}`);
  }
  //批量删除
  batchDeleteSchedules(scheduleIds: string[]): Observable<any> {
    return this.http.delete(`${this.baseUrl}/batch`, {
      body: scheduleIds,  // 注意：DELETE 请求的请求体需要使用 body 属性
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    });
  }

  // 更新排班状态
  updateScheduleStatus(scheduleId: string, status: string, updateUser?: string): Observable<any> {
    return this.http.put<ScheduleView>(`${this.baseUrl}/schedules/${scheduleId}/status`, { 
      status,
      updateUser 
    });
    //return this.http.put(`${this.baseUrl}/${scheduleId}/status`, { status });
  }
  updateSchedule(schedule: ScheduleSaveDTO): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/schedules/${schedule.scheduleId}`, schedule);
  }
  
  // 锁定排班
  lockSchedule(scheduleId: string): Observable<any> {
    return this.http.put(`${this.baseUrl}/${scheduleId}/lock`, {});
  }

  // 解锁排班
  unlockSchedule(scheduleId: string): Observable<any> {
    return this.http.put(`${this.baseUrl}/${scheduleId}/unlock`, {});
  }
}