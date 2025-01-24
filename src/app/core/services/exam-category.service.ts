import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ExamCategory, SearchParams } from '../models/ExamCategory';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ExamCategoryService {
  private apiUrl = `api/examcategory`; // 根据实际API地址调整
  constructor(private http: HttpClient) { }

  getAll(query?: SearchParams): Observable<ExamCategory[]> {
    let params = new HttpParams();
    if (query?.categoryCode) {
      params = params.set('categoryCode', query.categoryCode);
    }
    if (query?.categoryName) {
      params = params.set('categoryName', query.categoryName);
    }
    if (query?.isActive) {
      params = params.set('isActive', query.isActive);
    }
    if (query?.categoryType) {
      params = params.set('categoryType', query.categoryType);
    }
    return this.http.get<ExamCategory[]>(this.apiUrl, {params});
  }

  getById(id: string): Observable<ExamCategory> {
    return this.http.get<ExamCategory>(`${this.apiUrl}/${id}`);
  }

  create(category: Partial<ExamCategory>): Observable<ExamCategory> {
    return this.http.post<ExamCategory>(this.apiUrl, category);
  }

  update(id: string, category: Partial<ExamCategory>): Observable<ExamCategory> {
    return this.http.put<ExamCategory>(`${this.apiUrl}/${id}`, category);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
