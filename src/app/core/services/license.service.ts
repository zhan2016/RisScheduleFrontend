import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { License } from '../models/license-models';
import { System } from '../models/license-systems';
import { Env } from 'env';

@Injectable({
  providedIn: 'root'
})
export class LicenseService {

  private apiUrl = `api/licenses`; // 根据实际API地址调整

  constructor(private http: HttpClient) {}

  createLicense(license: Partial<License>): Observable<License> {
    return this.http.post<License>(this.apiUrl, license);
  }

  getLicenses(params: {
    hospitalName?: string;
    startDate?: Date;
    endDate?: Date;
    status?: string;
    page?: number;
    pageSize?: number;
  }): Observable<{ total: number; items: License[] }> {
    let httpParams = new HttpParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        if (value instanceof Date) {
          httpParams = httpParams.set(key, value.toISOString());
        } else {
          httpParams = httpParams.set(key, value.toString());
        }
      }
    });

    return this.http.get<{ total: number; items: License[] }>(this.apiUrl, { params: httpParams });
  }
  queryLicenses(params: {
    type?: 'MAIN' | 'PATCH',
    userId?: number
  }): Observable<License[]> {
    return this.http.get<License[]>(this.apiUrl, { params });
  }

  getPatchLicenses(mainLicenseId: string): Observable<License[]> {
    return this.http.get<License[]>(`${this.apiUrl}/${mainLicenseId}/patches`);
  }
  createPatchLicense(mainLicenseId: string, data: Partial<License>): Observable<License> {
    return this.http.post<License>(`${this.apiUrl}/${mainLicenseId}/patches`, data);
  }


  getLicenseById(id: string): Observable<License> {
    return this.http.get<License>(`${this.apiUrl}/${id}`);
  }

  updateLicense(id: string, license: Partial<License>): Observable<License> {
    return this.http.put<License>(`${this.apiUrl}/${id}`, license);
  }

  deleteLicense(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  verifyLicense(licenseFile: File): Observable<{ isValid: boolean; message: string }> {
    const formData = new FormData();
    formData.append('file', licenseFile);
    
    return this.http.post<{ isValid: boolean; message: string }>(
      `${this.apiUrl}/verify`,
      formData
    );
  }

  approveLicense(id: string): Observable<License> {
    return this.http.post<License>(`${this.apiUrl}/${id}/approve`, {});
  }

  rejectLicense(id: string, reason: string): Observable<License> {
    return this.http.post<License>(`${this.apiUrl}/${id}/reject`, { reason });
  }

  downloadLicenseFile(id: string): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/${id}/download`, {
      responseType: 'blob'
    });
  }
  downloadLicense(licenseId: string): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/${licenseId}/download`, {
      responseType: 'blob'
    });
  }
  getSystems(): Observable<System[]> {
    return this.http.get<System[]>('api/systems');
  }
    // 撤销授权
    revokeLicense(id: string): Observable<void> {
      return this.http.post<void>(`${this.apiUrl}/${id}/revoke`, {});
    }

}
