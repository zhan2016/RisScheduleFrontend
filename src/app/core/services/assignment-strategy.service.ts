import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AssignmentStrategy } from '../models/assigment-stragegy';

@Injectable({
  providedIn: 'root'
})
export class AssignmentStrategyService {
  private baseUrl = 'api/assignmentStrategy';

  constructor(private http: HttpClient) { }

  getStrategies(): Observable<AssignmentStrategy[]> {
    return this.http.get<AssignmentStrategy[]>(this.baseUrl);
  }

  getStrategy(id: string): Observable<AssignmentStrategy> {
    return this.http.get<AssignmentStrategy>(`${this.baseUrl}/${id}`);
  }

  createStrategy(strategy: AssignmentStrategy): Observable<AssignmentStrategy> {
    return this.http.post<AssignmentStrategy>(this.baseUrl, strategy);
  }

  updateStrategy(strategy: AssignmentStrategy): Observable<AssignmentStrategy> {
    return this.http.put<AssignmentStrategy>(`${this.baseUrl}/${strategy.strategyId}`, strategy);
  }

  deleteStrategy(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}