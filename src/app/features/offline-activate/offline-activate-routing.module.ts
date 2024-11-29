import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ActivateListComponent } from './activate-list/activate-list.component';

const routes: Routes = [
  {
    path: '',
    component: ActivateListComponent
  }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OfflineActivateRoutingModule { }
