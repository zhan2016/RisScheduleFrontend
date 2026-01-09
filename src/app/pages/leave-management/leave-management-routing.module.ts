import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserLeaveRequestComponent } from './user-leave-request/user-leave-request.component';

const routes: Routes = [
  {
      path: '',
      component: UserLeaveRequestComponent,
      data: { title: '假期管理' }
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LeaveManagementRoutingModule { }
