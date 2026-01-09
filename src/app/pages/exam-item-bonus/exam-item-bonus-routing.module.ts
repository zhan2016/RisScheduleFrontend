import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExamItemBonusDictComponent } from './exam-item-bonus-dict/exam-item-bonus-dict.component';

const routes: Routes = [
  {
    path: '',
    component: ExamItemBonusDictComponent,
    data: { title: '检查项目工作量管理' }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExamItemBonusRoutingModule { }
