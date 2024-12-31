import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ShiftRoutingModule } from './shift-routing.module';
import { ShiftTypeListComponent } from './shift-type-list/shift-type-list.component';
import { FormsModule } from '@angular/forms';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzTimePickerModule } from 'ng-zorro-antd/time-picker';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    ShiftTypeListComponent
  ],
  imports: [
    CommonModule,
    ShiftRoutingModule,
    CommonModule,
    FormsModule,
    NzCardModule,
    NzTableModule,
    NzFormModule,
    NzInputModule,
    NzButtonModule,
    NzSelectModule,
    NzModalModule,
    NzMessageModule,
    NzDividerModule,
    NzPopconfirmModule,
    NzTimePickerModule,
    NzInputNumberModule,
    NzRadioModule,
    ReactiveFormsModule
  ]
})
export class ShiftModule { }
