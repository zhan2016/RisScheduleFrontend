import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OfflineActivateRoutingModule } from './offline-activate-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzTimelineModule } from 'ng-zorro-antd/timeline';
import { NzResultModule } from 'ng-zorro-antd/result';

import { ActivateListComponent } from './activate-list/activate-list.component';
import { ActivationFormComponent } from './activation-form/activation-form.component';
import { ActivateSuccessComponent } from './activate-success/activate-success.component';


@NgModule({
  declarations: [
    ActivateListComponent,
    ActivationFormComponent,
    ActivateSuccessComponent
  ],
  imports: [
    CommonModule,
    OfflineActivateRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NzFormModule,
    NzInputModule,
    NzSelectModule,
    NzButtonModule,
    NzInputNumberModule,
    NzDatePickerModule,
    NzMessageModule,
    NzCardModule,
    NzIconModule,
    NzRadioModule,
    NzTagModule,
    NzSelectModule,
    NzTableModule,
    NzDividerModule,
    NzTabsModule,
    NzDropDownModule,
    NzModalModule,
    NzCheckboxModule,
    NzTimelineModule,
    NzResultModule,
  ]
})
export class OfflineActivateModule { }
