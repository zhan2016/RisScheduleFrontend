import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, forkJoin, of } from 'rxjs';
import { ShiftTypeService } from '../services/shift-type.service';
import { ReportGroupService } from '../services/report-group.service';
export interface ShiftReportGroupResolverData {
  shiftTypes: any[];
  reportGroups: any[];
}


@Injectable({
  providedIn: 'root'
})
export class ShiftReportGroupResolver implements Resolve<ShiftReportGroupResolverData> {
  constructor(
    private shiftTypeService: ShiftTypeService,
    private reportGroupService: ReportGroupService
  ) {}
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<ShiftReportGroupResolverData> {
    return forkJoin({
      shiftTypes: this.shiftTypeService.getShiftTypes({ isActive: '1' }),
      reportGroups: this.reportGroupService.getReportGroups({ isActive: '1' })
    });
  }
}
