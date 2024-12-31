import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StrategyListComponent } from './strategy-list/strategy-list.component';
import { StrategyFormComponent } from './strategy-form/strategy-form.component';

const routes: Routes = [
  {
    path:'',
    component: StrategyListComponent
  },
  { path: 'create', component: StrategyFormComponent },
  { path: ':id', component: StrategyFormComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AssignmentStrategyRoutingModule { }
