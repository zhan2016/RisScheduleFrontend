import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ShiftReportRoutingModule } from './shift-report-routing.module';
import { ShiftReportGroupListComponent } from './shift-report-group-list/shift-report-group-list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';


@NgModule({
  declarations: [
    ShiftReportGroupListComponent
  ],
  imports: [
    CommonModule,
    ShiftReportRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NzCardModule,
    NzFormModule,
    NzInputModule,
    NzButtonModule,
    NzSelectModule,
    NzTableModule,
    NzDividerModule,
    NzModalModule,
    NzMessageModule,
    NzInputNumberModule,
    NzRadioModule,
    NzPopconfirmModule
  ]
})
export class ShiftReportModule { }
