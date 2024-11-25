import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TemplateDesignRoutingModule } from './template-design-routing.module';
import { HomeComponent } from './home/home.component';


@NgModule({
  declarations: [
    HomeComponent
  ],
  imports: [
    CommonModule,
    TemplateDesignRoutingModule
  ]
})
export class TemplateDesignModule { }
