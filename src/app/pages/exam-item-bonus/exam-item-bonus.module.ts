import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ExamItemBonusRoutingModule } from './exam-item-bonus-routing.module';
import { ExamItemBonusDictComponent } from './exam-item-bonus-dict/exam-item-bonus-dict.component';
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
import { HttpClientModule } from '@angular/common/http';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';

@NgModule({
  declarations: [
    ExamItemBonusDictComponent
  ],
  imports: [
    CommonModule,
    ExamItemBonusRoutingModule,
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
    NzToolTipModule
  ]
})
export class ExamItemBonusModule { }
