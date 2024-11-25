import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EncryptionKeyListComponent } from './encryption-key-list/encryption-key-list.component';

const routes: Routes = [
  {
    path:'',
    component: EncryptionKeyListComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EncryptionRoutingModule { }
