import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AssignmentStrategyRoutingModule } from './assignment-strategy-routing.module';
import { StrategyListComponent } from './strategy-list/strategy-list.component';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { StrategyFormComponent } from './strategy-form/strategy-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';


@NgModule({
  declarations: [
    StrategyListComponent,
    StrategyFormComponent
  ],
  imports: [
    CommonModule,
    AssignmentStrategyRoutingModule,
    NzTableModule,
    NzDividerModule,
    FormsModule,
    ReactiveFormsModule,
    AssignmentStrategyRoutingModule,
    NzTableModule,
    NzFormModule,
    NzInputModule,
    NzButtonModule,
    NzRadioModule,
    NzSwitchModule,
    NzInputNumberModule,
    NzMessageModule,
    NzModalModule,
    NzToolTipModule
  ]
})
export class AssignmentStrategyModule { }
