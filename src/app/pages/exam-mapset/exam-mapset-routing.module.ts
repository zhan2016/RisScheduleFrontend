import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReportGroupListComponent } from './report-group-list/report-group-list.component';
import { ExamCategoryResolver } from 'src/app/core/resolver/exam-category.resolver';

const routes: Routes = [
  {
    path:'',
    component: ReportGroupListComponent,
    resolve: {
      categories: ExamCategoryResolver
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExamMapsetRoutingModule { }
