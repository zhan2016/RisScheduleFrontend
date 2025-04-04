import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, forkJoin, of } from 'rxjs';
import { ScheduleService } from 'src/app/core/services/schedule.service';

@Injectable({
  providedIn: 'root'
})
export class AssigmentManageResolver implements Resolve<any> {
  constructor(
    private scheduleService: ScheduleService
  ) {

  }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    return forkJoin({
      doctorList: this.scheduleService.getMyDepartmentDoctors(),
      //reportGroups: this.reportGroupService.getReportGroups({ isActive: '1' })
    });
    //return of(true);
  }
}
