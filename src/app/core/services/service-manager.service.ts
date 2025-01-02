import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ControlAllServicesResult, ControlledServiceInfo, ServiceOverallStatus } from '../models/service-manager';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ServiceManagerService {

  private apiUrl = '/api/service-manager';

  constructor(private http: HttpClient) {}

  getServices(): Observable<ControlledServiceInfo[]> {
    return this.http.get<ControlledServiceInfo[]>(`${this.apiUrl}/services`);
  }

  controlService(serviceName: string, enable: boolean): Observable<boolean> {
    return this.http.post<boolean>(`${this.apiUrl}/control`, {
      serviceName,
      enable,
    });
  }
  getOverallStatus(): Observable<ServiceOverallStatus> {
    return this.http.get<ServiceOverallStatus>(`${this.apiUrl}/overall-status`);
  }
  controlAllServices(enable: boolean, operator?: string): Observable<ControlAllServicesResult> {
    return this.http.post<ControlAllServicesResult>(`${this.apiUrl}/control-all`, {
      enable,
      operator:null
    });
  }
}
