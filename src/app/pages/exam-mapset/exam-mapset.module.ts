import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ExamMapsetRoutingModule } from './exam-mapset-routing.module';
import { ReportGroupListComponent } from './report-group-list/report-group-list.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { MonacoEditorModule } from 'ngx-monaco-editor';


@NgModule({
  declarations: [
    ReportGroupListComponent
  ],
  imports: [
    CommonModule,
    ExamMapsetRoutingModule,
    HttpClientModule,
    FormsModule,
    NzTableModule,
    NzButtonModule,
    NzModalModule,
    NzFormModule,
    NzInputModule,
    NzSelectModule,
    NzInputNumberModule,
    NzSwitchModule,
    NzMessageModule,
    NzIconModule,
    NzDividerModule,
    NzPopconfirmModule,
    NzTagModule,
    MonacoEditorModule.forRoot()
  ]
})
export class ExamMapsetModule { }
