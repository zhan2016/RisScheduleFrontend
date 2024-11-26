import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse } from '../interceptors/api-response.interceptor';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class BaseApiService {

  constructor(protected http: HttpClient) {}

  protected get<T>(url: string): Observable<T> {
    return this.http.get<ApiResponse<T>>(url).pipe(
      map(response => response.data)
    );
  }

  protected post<T>(url: string, body: any): Observable<T> {
    return this.http.post<ApiResponse<T>>(url, body).pipe(
      map(response => response.data)
    );
  }

  protected put<T>(url: string, body: any): Observable<T> {
    return this.http.put<ApiResponse<T>>(url, body).pipe(
      map(response => response.data)
    );
  }

  protected delete<T>(url: string): Observable<T> {
    return this.http.delete<ApiResponse<T>>(url).pipe(
      map(response => response.data)
    );
  }

  protected patch<T>(url: string, body: any): Observable<T> {
    return this.http.patch<ApiResponse<T>>(url, body).pipe(
      map(response => response.data)
    );
  }
}
