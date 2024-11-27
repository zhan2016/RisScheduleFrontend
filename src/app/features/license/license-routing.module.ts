import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomepageComponent } from './homepage/homepage.component';
import { LicenseListComponent } from './license-list/license-list.component';
import { PatchPageComponent } from './patch-page/patch-page.component';

const routes: Routes = [
  {
    path: 'generate',
    component: HomepageComponent
  },
  {
    path:'query',
    component: LicenseListComponent
  },
  {
    path:'patch',
    component: PatchPageComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LicenseRoutingModule { }
