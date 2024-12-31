import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExamKindListComponent } from './exam-kind-list/exam-kind-list.component';

const routes: Routes = [
  {
    path:'',
    component: ExamKindListComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExamKindRoutingModule { }
