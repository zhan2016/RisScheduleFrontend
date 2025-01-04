import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AssigmentManageRoutingModule } from './assigment-manage-routing.module';
import { ReportAssignmentComponent } from './report-assignment/report-assignment.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// NG-ZORRO 组件
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { TransferModalComponent } from './transfer-modal/transfer-modal.component';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { AssignmentHistoryModalComponent } from './assignment-history-modal/assignment-history-modal.component';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { EllipsisCellComponent } from './ellipsis-cell/ellipsis-cell.component';
import { AgGridModule } from 'ag-grid-angular';
import { StatusTagComponent } from './status-tag/status-tag.component';

@NgModule({
  declarations: [
    ReportAssignmentComponent,
    TransferModalComponent,
    AssignmentHistoryModalComponent,
    EllipsisCellComponent,
    StatusTagComponent
  ],
  imports: [
    CommonModule,
    AssigmentManageRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    
    // NG-ZORRO 模块
    NzFormModule,
    NzInputModule,
    NzButtonModule,
    NzSelectModule,
    NzGridModule,
    NzIconModule,
    NzTableModule,
    NzTagModule,
    NzModalModule,
    NzPaginationModule,
    NzDatePickerModule,
    NzCheckboxModule,
    NzToolTipModule,
    NzToolTipModule,
    AgGridModule.withComponents([]),
  ]
})
export class AssigmentManageModule { }
