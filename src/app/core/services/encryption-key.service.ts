import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EncryptionKey, KeyStatus } from '../models/encryption-key';
import { PaginatedResponse } from '../models/common-models';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EncryptionKeyService {

  private apiUrl = 'api/encryption-keys';

  constructor(private http: HttpClient) {}

  getKeys(params?: {
    name?: string;
    status?: KeyStatus;
    page?: number;
    pageSize?: number;
  }): Observable<PaginatedResponse<EncryptionKey>> {
    let httpParams = new HttpParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          httpParams = httpParams.set(key, String(value));
        }
      });
    }
    return this.http.get<PaginatedResponse<EncryptionKey>>(this.apiUrl, { params: httpParams });
  }

  getKey(id: string): Observable<EncryptionKey> {
    return this.http.get<EncryptionKey>(`${this.apiUrl}/${id}`);
  }

  createKey(key: Partial<EncryptionKey>): Observable<EncryptionKey> {
    return this.http.post<EncryptionKey>(this.apiUrl, key);
  }

  updateKey(id: string, key: Partial<EncryptionKey>): Observable<EncryptionKey> {
    return this.http.put<EncryptionKey>(`${this.apiUrl}/${id}`, key);
  }

  deleteKey(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  setDefault(id: string): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}/default`, {});
  }

  updateStatus(id: string, status: KeyStatus): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}/status`, { status });
  }
}
