import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ModuleRoutingModule } from './module-routing.module';
import { ListManageComponent } from './list-manage/list-manage.component';
import { ModuleFormComponent } from './module-form/module-form.component';

import { NzTableModule } from 'ng-zorro-antd/table';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzRadioModule } from 'ng-zorro-antd/radio';

@NgModule({
  declarations: [
    ListManageComponent,
    ModuleFormComponent
  ],
  imports: [
    CommonModule,
    ModuleRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NzTableModule,
    NzCardModule,
    NzButtonModule,
    NzInputModule,
    NzFormModule,
    NzInputNumberModule,
    NzSwitchModule,
    NzModalModule,
    NzMessageModule,
    NzDividerModule,
    NzPopconfirmModule,
    NzBadgeModule,
    NzIconModule,
    NzSpaceModule,
    NzSelectModule,
    NzTagModule,
    NzRadioModule
  ]
})
export class ModuleModule { }
