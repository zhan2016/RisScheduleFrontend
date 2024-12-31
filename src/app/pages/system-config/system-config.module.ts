import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SystemConfigRoutingModule } from './system-config-routing.module';
import { ManageComponent } from './manage/manage.component';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    ManageComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SystemConfigRoutingModule,
    NzCardModule,
    NzTabsModule,
    NzFormModule,
    NzSelectModule,
    NzInputModule,
    NzInputNumberModule,
    NzButtonModule,
    NzMessageModule,
    NzDividerModule
  ]
})
export class SystemConfigModule { }
