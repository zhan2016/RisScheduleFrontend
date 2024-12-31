import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ShiftType, ShiftTypeQuery } from '../models/shift';

@Injectable({
  providedIn: 'root'
})
export class ShiftTypeService {
  private baseUrl = 'api/shiftType';

  constructor(private http: HttpClient) {}

  getShiftTypes(query: ShiftTypeQuery = {}): Observable<ShiftType[]> {
    let params = new HttpParams();
    if (query.shiftTypeCode) {
      params = params.set('shiftTypeCode', query.shiftTypeCode);
    }
    if (query.shiftTypeName) {
      params = params.set('shiftTypeName', query.shiftTypeName);
    }
    if (query.isActive) {
      params = params.set('isActive', query.isActive);
    }
    return this.http.get<ShiftType[]>(this.baseUrl, { params });
  }

  getShiftType(id: string): Observable<ShiftType> {
    return this.http.get<ShiftType>(`${this.baseUrl}/${id}`);
  }

  createShiftType(shiftType: Partial<ShiftType>): Observable<ShiftType> {
    return this.http.post<ShiftType>(this.baseUrl, shiftType);
  }

  updateShiftType(id: string, shiftType: Partial<ShiftType>): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${id}`, shiftType);
  }

  deleteShiftType(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
