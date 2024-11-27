import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainLayoutComponent } from './component/main-layout/main-layout.component';
import { AppRoutingModule } from '../app-routing.module';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { ReactiveFormsModule } from '@angular/forms';

import { UserInfoModalComponent } from './component/user-info-modal/user-info-modal.component';
import { ChangePasswordModalComponent } from './component/change-password-modal/change-password-modal.component';
import { LoadingCarComponent } from './component/loading-car/loading-car.component';

@NgModule({
  declarations: [
    MainLayoutComponent,
    UserInfoModalComponent,
    ChangePasswordModalComponent,
    LoadingCarComponent
  ],
  imports: [
    CommonModule,
    AppRoutingModule,
    NzLayoutModule,
    NzMenuModule,
    NzIconModule,
    NzDropDownModule,
    NzAvatarModule,
    NzModalModule,
    NzMessageModule,
    NzFormModule,
    NzInputModule,
    NzButtonModule,
    ReactiveFormsModule
  ],
  exports: [
    MainLayoutComponent,
    LoadingCarComponent
  ]
})
export class SharedModule { }
