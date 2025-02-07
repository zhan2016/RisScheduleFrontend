import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LicenseInfoComponent } from './license-info/license-info.component';

const routes: Routes = [
  {
    path:'',
    component:LicenseInfoComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LicenseRoutingModule { }
