import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ShiftReportGroupListComponent } from './shift-report-group-list/shift-report-group-list.component';
import { ShiftReportGroupResolver } from 'src/app/core/resolver/shift-report-group.resolver';

const routes: Routes = [
  {
    path:'',
    component: ShiftReportGroupListComponent,
    resolve: {
        resolverData: ShiftReportGroupResolver
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ShiftReportRoutingModule { }
