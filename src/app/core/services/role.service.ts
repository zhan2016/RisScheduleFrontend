import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseApiService } from './base-api.service';
import { Observable } from 'rxjs';
import { Role } from '../models/role-permission';

@Injectable({
  providedIn: 'root'
})
export class RoleService extends BaseApiService {

  private baseUrl = '/api/roles'; // 调整为你的API路径

  constructor(protected override http: HttpClient) {
    super(http);
  }

  getRoles(): Observable<Role[]> {
    return this.http.get<Role[]>(this.baseUrl);
  }
}
