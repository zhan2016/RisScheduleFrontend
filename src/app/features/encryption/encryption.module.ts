import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzRadioModule } from 'ng-zorro-antd/radio';

import { EncryptionRoutingModule } from './encryption-routing.module';
import { EncryptionKeyListComponent } from './encryption-key-list/encryption-key-list.component';
import { EncryptionKeyFormComponent } from './encryption-key-form/encryption-key-form.component';


@NgModule({
  declarations: [
    EncryptionKeyListComponent,
    EncryptionKeyFormComponent
  ],
  imports: [
    CommonModule,
    EncryptionRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NzTableModule,
    NzFormModule,
    NzInputModule,
    NzButtonModule,
    NzTagModule,
    NzModalModule,
    NzSelectModule,
    NzMessageModule,
    NzCardModule,
    NzDividerModule,
    NzIconModule,
    NzPopconfirmModule,
    NzRadioModule
  ],
  exports: [
    EncryptionKeyListComponent
  ]
})
export class EncryptionModule { }
