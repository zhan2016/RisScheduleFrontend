import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ExamKindRoutingModule } from './exam-kind-routing.module';
import { ExamKindListComponent } from './exam-kind-list/exam-kind-list.component';
import { FormsModule } from '@angular/forms';

import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzTreeSelectModule } from 'ng-zorro-antd/tree-select';
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
    ExamKindListComponent
  ],
  imports: [
    CommonModule,
    ExamKindRoutingModule,
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
export class ExamKindModule { }
