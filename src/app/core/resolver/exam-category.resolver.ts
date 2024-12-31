import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { ExamCategoryService } from '../services/exam-category.service';
import { ExamCategory } from '../models/ExamCategory';

@Injectable({
  providedIn: 'root'
})
export class ExamCategoryResolver implements Resolve<ExamCategory[]> {
  constructor(private examCategoryService: ExamCategoryService) {}

  resolve(): Observable<ExamCategory[]> {
    return this.examCategoryService.getAll();
  }
}
