import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SystemConfigService {

  private baseUrl = 'api/SystemConfig';

  constructor(private http: HttpClient) {}

  getCacheTypes(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/cache-types`);
  }

  refreshCache(cacheTypes: string[], reason: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/refresh-cache`, { cacheTypes, reason });
  }

  getSettings(): Observable<any> {
    return this.http.get(`${this.baseUrl}/settings`);
  }

  updateSettings(settings: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/settings`, settings);
  }
}
