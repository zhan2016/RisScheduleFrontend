import { NgModule } from '@angular/core';
import { CommonModule, DatePipe, DecimalPipe } from '@angular/common';
import { AgGridModule } from 'ag-grid-angular';

import { ManageReportsRoutingModule } from './manage-reports-routing.module';
import { EmrUsageComponent } from './emr-usage/emr-usage.component';
import { ClinicalLogComponent } from './clinical-log/clinical-log.component';
import { SharedModule } from '../../shared/shared.module';
import { OverviewComponent } from './doctor-bonus/overview/overview.component';
import { RegistrationIncomeComponent } from './doctor-bonus/registration-income/registration-income.component';
import { ExpertIncomeComponent } from './doctor-bonus/expert-income/expert-income.component';
import { DoctorBonusModule } from './doctor-bonus/doctor-bonus-module/doctor-bonus.module';
import { DoctorClinicalCountIncomeComponent } from './doctor-bonus/doctor-clinical-count-income/doctor-clinical-count-income.component';

@NgModule({
  declarations: [
    EmrUsageComponent,
    ClinicalLogComponent,
    OverviewComponent,
    RegistrationIncomeComponent,
    ExpertIncomeComponent,
    DoctorClinicalCountIncomeComponent,
  ],
  providers: [
    DecimalPipe,
    DatePipe,
  ],
  imports: [
    CommonModule,
    ManageReportsRoutingModule,
    AgGridModule.withComponents([]),
    SharedModule,
    DoctorBonusModule,

  ]
})
export class ManageReportsModule { }
