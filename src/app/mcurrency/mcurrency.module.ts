import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { McurrencyRoutingModule } from './mcurrency-routing.module';
import { McurrencyComponent } from './mcurrency.component';
import { MconfigurationComponent } from './mconfiguration/mconfiguration.component';
import { EntryComponent } from './entry/entry.component';
import { ReportingComponent } from './reporting/reporting.component';


@NgModule({
  declarations: [
    McurrencyComponent,
    MconfigurationComponent,
    EntryComponent,
    ReportingComponent,
  ],
  imports: [
    CommonModule,
    McurrencyRoutingModule,
  ]
})
export class McurrencyModule { }
