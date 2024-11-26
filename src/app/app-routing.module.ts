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
        path: 'licenses',
        loadChildren: () => import('./features/license/license.module')
          .then(m => m.LicenseModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'systems',
        loadChildren: () => import('./features/system/system.module')
          .then(m => m.SystemModule),
        canActivate: [AuthGuard, AdminGuard]
      },
      {
        path: 'modules',
        loadChildren: () => import('./features/module/module.module')
          .then(m => m.ModuleModule),
        canActivate: [AuthGuard, AdminGuard]
      },
      {
        path: 'encryptionKeys',
        loadChildren: () => import('./features/encryption/encryption.module')
          .then(m => m.EncryptionModule),
        canActivate: [AuthGuard, AdminGuard]
      },
      {
        path: 'users',
        loadChildren: () => import('./features/users/users.module')
          .then(m => m.UsersModule),
        canActivate: [AuthGuard, AdminGuard]
      },
    ]
  },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
