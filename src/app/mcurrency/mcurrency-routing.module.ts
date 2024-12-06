import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MconfigurationComponent } from './mconfiguration/mconfiguration.component';
import { EntryComponent } from './entry/entry.component';
import { ReportingComponent } from './reporting/reporting.component';
import { ShellComponent } from '../core/shell/shell.component';
import { Route } from '../core/route/route.service';

const routes: Routes = [
  Route.withShell([
    {
      path: '',
      redirectTo: 'configuration',
      pathMatch: 'full',
    },
    {
      path: 'configuration',
      component: MconfigurationComponent,
      data: {title: 'configuration', breadcrumb: 'Multi-currency Configuration'},
    },
    {
      path: 'entry',
      component: EntryComponent,
      data: {title: 'Entry', breadcrumb: 'Multi-currency Journal Entry'},
    },
    {
      path: 'reporting',
      component: ReportingComponent,
      data: {title: 'Reporting', breadcrumb: 'Multi-currency Reporting'},
    }

  ])

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class McurrencyRoutingModule { }
