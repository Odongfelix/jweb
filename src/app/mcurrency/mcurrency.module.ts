import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { McurrencyRoutingModule } from './mcurrency-routing.module';
import { McurrencyComponent } from './mcurrency.component';


@NgModule({
  declarations: [
    McurrencyComponent
  ],
  imports: [
    CommonModule,
    McurrencyRoutingModule
  ]
})
export class McurrencyModule { }
