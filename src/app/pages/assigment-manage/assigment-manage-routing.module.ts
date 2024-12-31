import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReportAssignmentComponent } from './report-assignment/report-assignment.component';
import { AssigmentManageResolver } from './assignment-manage.resolver';

const routes: Routes = [
  {
    path:'',
    component: ReportAssignmentComponent,
    resolve: {
      resolverData: AssigmentManageResolver
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AssigmentManageRoutingModule { }
