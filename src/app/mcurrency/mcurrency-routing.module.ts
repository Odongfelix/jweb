import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MconfigurationComponent } from './mconfiguration/mconfiguration.component';
import { EntryComponent } from './entry/entry.component';
import { ReportingComponent } from './reporting/reporting.component';
import {Route} from '../core/route/route.service'

const routes: Routes = [
  Route.withShell([
    {
    path: '',
    redirectTo: '/',
    pathMatch: 'full',
  },
    {
      path: 'mutli-currency/configuration',
      component: MconfigurationComponent
    },
    {
      path: 'multi-currency/entry',
      component: EntryComponent
    },
    {
      path: 'multi-currency/reporting',
      component: ReportingComponent
    }])
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class McurrencyRoutingModule { }
