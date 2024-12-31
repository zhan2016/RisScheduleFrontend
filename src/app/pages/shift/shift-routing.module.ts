import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ShiftTypeListComponent } from './shift-type-list/shift-type-list.component';

const routes: Routes = [
  {
    path: '',
    component: ShiftTypeListComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ShiftRoutingModule { }
