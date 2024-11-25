import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CreateModuleDto, Module, ModuleQuery, UpdateModuleDto } from '../models/license-module';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ModuleService {
  private apiUrl = '/api/modules';

  constructor(private http: HttpClient) {}

  getModules(query: ModuleQuery & { page?: number; pageSize?: number }): Observable<{
    data: Module[];
    total: number;
  }> {
    let params = new HttpParams();
    
    Object.entries(query).forEach(([key, value]) => {
      if (value != null) {
        params = params.set(key, value.toString());
      }
    });

    return this.http.get<{ data: Module[]; total: number }>(this.apiUrl, { params });
  }

  getModule(id: string): Observable<Module> {
    return this.http.get<Module>(`${this.apiUrl}/${id}`);
  }

  createModule(module: CreateModuleDto): Observable<Module> {
    return this.http.post<Module>(this.apiUrl, module);
  }

  updateModule(id: string, module: UpdateModuleDto): Observable<Module> {
    return this.http.put<Module>(`${this.apiUrl}/${id}`, module);
  }

  deleteModule(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
