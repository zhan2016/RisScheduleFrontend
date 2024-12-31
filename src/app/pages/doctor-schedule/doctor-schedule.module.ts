import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DoctorScheduleRoutingModule } from './doctor-schedule-routing.module';
import { ScheduleComponent } from './schedule/schedule.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// NG-ZORRO 组件
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { ScheduleFilterPipe } from 'src/app/core/pipes/schedule.pipe';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { BatchScheduleModalComponent } from './batch-schedule-modal/batch-schedule-modal.component';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzCalendarModule } from 'ng-zorro-antd/calendar';
import { AddScheduleModalComponent } from './add-schedule-modal/add-schedule-modal.component';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { EditScheduleModalComponent } from './edit-schedule-modal/edit-schedule-modal.component';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { DoctorScheduleItemComponent } from './doctor-schedule-item/doctor-schedule-item.component';

@NgModule({
  declarations: [
    ScheduleComponent,
    ScheduleFilterPipe,
    BatchScheduleModalComponent,
    AddScheduleModalComponent,
    EditScheduleModalComponent,
    DoctorScheduleItemComponent
  ],
  imports: [
    CommonModule,
    DoctorScheduleRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NzFormModule,
    NzSelectModule,
    NzMessageModule,
    NzSpaceModule,
    NzGridModule,
    NzIconModule,
    NzRadioModule,
    NzButtonModule,
    NzTabsModule,
    NzTableModule,
    NzDividerModule,
    NzSpinModule,
    NzDatePickerModule,
    NzBadgeModule,
    NzCalendarModule,
    NzTagModule,
    NzDropDownModule,
    NzInputModule,
    NzInputNumberModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory
    })
  ]
})
export class DoctorScheduleModule { }
