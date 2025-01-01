import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LicenseInfo, LicenseStatus } from '../models/license-info';
@Injectable({
  providedIn: 'root'
})
export class LicenseService {
  private apiUrl = '/api/licenseinfo';

  constructor(private http: HttpClient) { }

  getLicenseInfo(): Observable<LicenseInfo> {
    return this.http.get<LicenseInfo>(`${this.apiUrl}/info`);
  }

  getHardwareId(): Observable<string> {
    return this.http.get<string>(`${this.apiUrl}/hardware-id`);
  }

  getLicenseStatus(): Observable<LicenseStatus> {
    return this.http.get<LicenseStatus>(`${this.apiUrl}/status`);
  }
}