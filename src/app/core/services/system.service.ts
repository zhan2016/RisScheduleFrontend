import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CreateModuleDto, Module, UpdateModuleDto } from '../models/license-module';
import { PaginatedResponse } from '../models/common-models';
import { CreateSystemDto, System, SystemStatus, UpdateSystemDto } from '../models/license-systems';

@Injectable({
  providedIn: 'root'
})
export class SystemService {

  private apiUrl = 'api/systems';

  constructor(private http: HttpClient) {}

  // 系统相关方法
  getSystems(params?: {
    name?: string;
    status?: SystemStatus;
    authType?: string;
    independentAuth?: boolean;
    page?: number;
    pageSize?: number;
  }): Observable<PaginatedResponse<System>> {
    let httpParams = new HttpParams();
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          httpParams = httpParams.set(key, String(value));
        }
      });
    }

    return this.http.get<PaginatedResponse<System>>(this.apiUrl, { params: httpParams });
  }

  getSystemById(id: string): Observable<System> {
    return this.http.get<System>(`${this.apiUrl}/${id}`);
  }

  createSystem(system: CreateSystemDto): Observable<System> {
    return this.http.post<System>(this.apiUrl, system);
  }

  updateSystem(id: number, system: UpdateSystemDto): Observable<System> {
    return this.http.put<System>(`${this.apiUrl}/${id}`, system);
  }

  deleteSystem(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // 系统状态变更
  updateSystemStatus(id: string, status: SystemStatus): Observable<System> {
    return this.http.patch<System>(`${this.apiUrl}/${id}/status`, { status });
  }

  // 批量系统操作
  batchUpdateSystemStatus(ids: string[], status: SystemStatus): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/batch/status`, { ids, status });
  }

  batchDeleteSystems(ids: string[]): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/batch-delete`, { ids });
  }

  // 模块相关方法
  getModules(params?: {
    systemId?: string;
    name?: string;
    status?: string;
    authType?: string;
    independentAuth?: boolean;
    parentId?: string;
    page?: number;
    pageSize?: number;
  }): Observable<PaginatedResponse<Module>> {
    let httpParams = new HttpParams();
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          httpParams = httpParams.set(key, String(value));
        }
      });
    }

    return this.http.get<PaginatedResponse<Module>>(`${this.apiUrl}/modules`, { params: httpParams });
  }

  getModulesBySystem(systemId: string, params?: {
    parentId?: string;
    includeChildren?: boolean;
  }): Observable<Module[]> {
    let httpParams = new HttpParams();
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          httpParams = httpParams.set(key, String(value));
        }
      });
    }

    return this.http.get<Module[]>(`${this.apiUrl}/${systemId}/modules`, { params: httpParams });
  }

  getModuleById(systemId: string, moduleId: string): Observable<Module> {
    return this.http.get<Module>(`${this.apiUrl}/${systemId}/modules/${moduleId}`);
  }

  createModule(systemId: string, module: CreateModuleDto): Observable<Module> {
    return this.http.post<Module>(`${this.apiUrl}/${systemId}/modules`, module);
  }

  updateModule(systemId: string, moduleId: string, module: UpdateModuleDto): Observable<Module> {
    return this.http.put<Module>(`${this.apiUrl}/${systemId}/modules/${moduleId}`, module);
  }

  deleteModule(systemId: string, moduleId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${systemId}/modules/${moduleId}`);
  }

  // 模块状态变更
  updateModuleStatus(systemId: string, moduleId: string, status: string): Observable<Module> {
    return this.http.patch<Module>(
      `${this.apiUrl}/${systemId}/modules/${moduleId}/status`,
      { status }
    );
  }

  // 批量模块操作
  batchUpdateModules(systemId: string, modules: UpdateModuleDto[]): Observable<Module[]> {
    return this.http.put<Module[]>(`${this.apiUrl}/${systemId}/modules/batch`, modules);
  }

  batchDeleteModules(systemId: string, moduleIds: string[]): Observable<void> {
    return this.http.post<void>(
      `${this.apiUrl}/${systemId}/modules/batch-delete`,
      { moduleIds }
    );
  }

  batchUpdateModuleStatus(
    systemId: string,
    moduleIds: string[],
    status: string
  ): Observable<void> {
    return this.http.patch<void>(
      `${this.apiUrl}/${systemId}/modules/batch/status`,
      { moduleIds, status }
    );
  }

  // 模块排序
  updateModuleSort(systemId: string, sortData: {
    moduleId: string;
    newIndex: number;
  }[]): Observable<void> {
    return this.http.post<void>(
      `${this.apiUrl}/${systemId}/modules/sort`,
      sortData
    );
  }
}
