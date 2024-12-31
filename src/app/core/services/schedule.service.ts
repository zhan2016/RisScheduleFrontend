// schedule.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ShiftType } from '../models/shift';
import { DoctorSchedule, ScheduleQueryDTO, ScheduleSaveDTO, ScheduleView } from '../models/doctor-shedule';
import { ShiftTypeService } from './shift-type.service';
import { format } from 'date-fns';

@Injectable({
  providedIn: 'root'
})
export class ScheduleService {
  private baseUrl = '/api/schedule';

  constructor(
    private http: HttpClient,
    private shiftTypeApi: ShiftTypeService
  ) {}

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
  getSchedules(query: ScheduleQueryDTO): Observable<ScheduleView[]> {
    let params = new HttpParams();
    if (query.doctorId) {
      params = params.set('doctorId', query.doctorId);
    }
    if (query.startDate) {
      params = params.set('startDate', query.startDate);
    }
    if (query.endDate) {
      params = params.set('endDate', query.endDate);
    }
    if (query.shiftTypeId) {
      params = params.set('shiftTypeId', query.shiftTypeId);
    }
    if (query.status) {
      params = params.set('status', query.status);
    }

    return this.http.get<ScheduleView[]>(`${this.baseUrl}/list`, { params });
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
    return this.http.post(`${this.baseUrl}/batch`, schedules);
  }

  // 删除排班
  deleteSchedule(scheduleId: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${scheduleId}`);
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