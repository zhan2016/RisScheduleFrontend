import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WelcomeComponent } from './pages/welcome/welcome.component';
import { AuthGuard } from './core/guards/auth.guard';
import { AdminGuard } from './core/guards/admin.guard';
import { MainLayoutComponent } from './shared/component/main-layout/main-layout.component';

const routes: Routes = [
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then(m => m.LoginModule)
  },
  {
    path: '',
    component: MainLayoutComponent, // 创建一个主布局组件
    canActivate: [AuthGuard],
    children: [
      {
        path: 'welcome',
        loadChildren: () => import('./pages/welcome/welcome.module').then(m => m.WelcomeModule),
        canActivate: [AuthGuard],
      },
      {
        path: 'examKind',
        loadChildren: () => import('./pages/exam-kind/exam-kind.module').then(m => m.ExamKindModule),
        canActivate: [AuthGuard],
      },
      {
        path: 'examMapset',
        loadChildren: () => import('./pages/exam-mapset/exam-mapset.module')
          .then(m => m.ExamMapsetModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'shift',
        loadChildren: () => import('./pages/shift/shift.module')
        .then(m => m.ShiftModule),
        canActivate: [AuthGuard]
        
      },
      {
        path: 'shiftReportGroup',
        loadChildren: () => import('./pages/shift-report/shift-report.module')
        .then(m => m.ShiftReportModule),
         canActivate: [AuthGuard, AdminGuard]
      },
      {
        path: 'assigmentManage',  // 空路径
        //redirectTo: 'assigmentManage',
        loadChildren: () => import('./pages/assigment-manage/assigment-manage.module')
        .then(m => m.AssigmentManageModule),
         canActivate: [AuthGuard, AdminGuard]
      },
      {
        path: 'doctorSchedule',
        loadChildren: () => import('./pages/doctor-schedule/doctor-schedule.module')
        .then(m => m.DoctorScheduleModule),
        canActivate: [AuthGuard, AdminGuard]
      },
      {
        path: 'exam-item-dict',
        loadChildren: () => import('./pages/exam-item-bonus/exam-item-bonus.module')
        .then(m => m.ExamItemBonusModule),
        canActivate: [AuthGuard, AdminGuard]
      },
       {
        path: 'user-leave',
        loadChildren: () => import('./pages/leave-management/leave-management.module')
        .then(m => m.LeaveManagementModule),
        canActivate: [AuthGuard, AdminGuard]
      },
      {
        path: 'assignmentStrategy',
        loadChildren: () => import('./pages/assignment-strategy/assignment-strategy.module')
        .then(m => m.AssignmentStrategyModule),
        canActivate: [AuthGuard, AdminGuard]
      },
      {
        path: 'systemConfig',
        loadChildren: () => import('./pages/system-config/system-config.module')
          .then(m => m.SystemConfigModule),
        canActivate: [AuthGuard, AdminGuard]
      },
      {
        path: 'license',
        loadChildren: () => import('./pages/license/license.module')
          .then(m => m.LicenseModule),
      },
    ]
  },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
