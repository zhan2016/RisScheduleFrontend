import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ExamItemDict, ExamItemDictQueryDTO, BatchUpdateWorkloadDTO, PageResult } from '../models/exam-item-dict';

@Injectable({
  providedIn: 'root'
})
export class ExamItemDictService {
  private baseUrl = '/api/ExamItemDict';

  constructor(private http: HttpClient) { }

  // 分页查询检查项目
  getExamItems(query: ExamItemDictQueryDTO): Observable<PageResult<ExamItemDict>> {
    let params = new HttpParams();
    
    Object.keys(query).forEach(key => {
      const value = (query as any)[key];
      if (value !== null && value !== undefined && value !== '') {
        params = params.set(key, value.toString());
      }
    });

    return this.http.get<PageResult<ExamItemDict>>(`${this.baseUrl}`, { params });
  }

  // 获取单个检查项目详情
  getExamItem(serialNo: string): Observable<ExamItemDict> {
    return this.http.get<ExamItemDict>(`${this.baseUrl}/${serialNo}`);
  }

  // 更新检查项目
  updateExamItem(serialNo: string, item: Partial<ExamItemDict>): Observable<any> {
    return this.http.put(`${this.baseUrl}/${serialNo}`, { ...item, serialNo });
  }

  // 批量更新报告工作量
  batchUpdateWorkload(dto: BatchUpdateWorkloadDTO): Observable<any> {
    return this.http.post(`${this.baseUrl}/batch-update-workload`, dto);
  }
}