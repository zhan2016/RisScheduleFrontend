import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/core/guard/auth.guard';
import { ClinicalLogComponent } from './clinical-log/clinical-log.component';
import { DoctorBonusModule } from './doctor-bonus/doctor-bonus-module/doctor-bonus.module';
import { EmrUsageComponent } from './emr-usage/emr-usage.component';

const routes: Routes = [
  {
    path:'',
    component: EmrUsageComponent,
  },
  {
    path:'emr-usage',
    component: EmrUsageComponent,
  },
  {
    path: 'doctor-bonus',
    canActivate: [AuthGuard],
    loadChildren: () => import('./doctor-bonus/doctor-bonus-module/doctor-bonus.module').then(m => m.DoctorBonusModule)
  },
  {
    path:'clinical-log',
    component: ClinicalLogComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManageReportsRoutingModule { }
