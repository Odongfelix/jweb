import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MconfigurationComponent } from './mconfiguration/mconfiguration.component';
import { EntryComponent } from './entry/entry.component';
import { ReportingComponent } from './reporting/reporting.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'configuration',
    pathMatch: 'full',
  },
  {
    path: 'configuration',
    component: MconfigurationComponent
  },
  {
    path: 'entry',
    component: EntryComponent
  },
  {
    path: 'reporting',
    component: ReportingComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class McurrencyRoutingModule { }
