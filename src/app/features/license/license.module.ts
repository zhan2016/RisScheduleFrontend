import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LicenseRoutingModule } from './license-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { HomepageComponent } from './homepage/homepage.component';
import { LicenseFormComponent } from './license-form/license-form.component';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzTimelineModule } from 'ng-zorro-antd/timeline';

import { LicenseListComponent } from './license-list/license-list.component';
import { PatchPageComponent } from './patch-page/patch-page.component';

@NgModule({
  declarations: [
    HomepageComponent,
    LicenseFormComponent,
    LicenseListComponent,
    PatchPageComponent
  ],
  imports: [
    CommonModule,
    LicenseRoutingModule,
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
    NzTimelineModule
  ]
})
export class LicenseModule { }
