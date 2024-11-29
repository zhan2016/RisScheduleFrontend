import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivationQuery, BatchActivationRequest, BatchActivationResult, OfflineActivation, OfflineActivationResponse } from '../models/offline-activate';
import { Observable } from 'rxjs';
import { PaginatedResponse } from '../models/common-models';

@Injectable({
  providedIn: 'root'
})
export class OfflineActivateService {
  private apiUrl = '/api/offline-activations';
  constructor(
    private http: HttpClient
  ) { }

  getActivations(query: ActivationQuery): Observable<PaginatedResponse<OfflineActivationResponse>> {
    let httpParams = new HttpParams();
    
    if (query) {
      Object.entries(query).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          httpParams = httpParams.set(key, String(value));
        }
      });
    }
    return this.http.get<PaginatedResponse<OfflineActivationResponse>>(this.apiUrl, { params: httpParams });
  }

  getActivation(id: string): Observable<OfflineActivation> {
    return this.http.get<OfflineActivation>(`${this.apiUrl}/${id}`);
  }

  createActivation(activation: Partial<OfflineActivation>): Observable<OfflineActivation> {
    return this.http.post<OfflineActivation>(this.apiUrl, activation);
  }

  updateActivation(id: string, activation: Partial<OfflineActivation>): Observable<OfflineActivation> {
    return this.http.put<OfflineActivation>(`${this.apiUrl}/${id}`, activation);
  }

  deleteActivation(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
  batchCreateActivations(request: BatchActivationRequest): Observable<BatchActivationResult[]> {
    return this.http.post<BatchActivationResult[]>(`${this.apiUrl}/batch`, request);
  }
}
