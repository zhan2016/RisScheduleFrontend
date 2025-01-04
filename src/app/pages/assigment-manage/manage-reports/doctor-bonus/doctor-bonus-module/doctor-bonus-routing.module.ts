import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DoctorClinicalCountIncomeComponent } from '../doctor-clinical-count-income/doctor-clinical-count-income.component';
import { ExpertIncomeComponent } from '../expert-income/expert-income.component';
import { OverviewComponent } from '../overview/overview.component';
import { RegistrationIncomeComponent } from '../registration-income/registration-income.component';

const routes: Routes = [
  {
    path:'',
    component: OverviewComponent,
  },
  {
    path:'overview',
    component: OverviewComponent,
  },
  {
    path:'registration-income',
    component: RegistrationIncomeComponent,
  },
  {
    path:'expert-income',
    component: ExpertIncomeComponent,
  },
  {
    path:'doctor-clinical-count-income',
    component: DoctorClinicalCountIncomeComponent,
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DoctorBonusRoutingModule { }
