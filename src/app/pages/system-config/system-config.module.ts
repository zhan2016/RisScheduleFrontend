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
import { ServiceManagerComponent } from './service-manager/service-manager.component';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzTimelineModule } from 'ng-zorro-antd/timeline';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzStatisticModule } from 'ng-zorro-antd/statistic';
import { NzGridModule } from 'ng-zorro-antd/grid';

@NgModule({
  declarations: [
    ManageComponent,
    ServiceManagerComponent
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
    NzDividerModule,
    NzModalModule,
    NzTimelineModule,
    NzSwitchModule,
    NzTagModule,
    NzTableModule,
    NzIconModule,
    NzSpaceModule,
    NzStatisticModule,
    NzGridModule
  ]
})
export class SystemConfigModule { }
