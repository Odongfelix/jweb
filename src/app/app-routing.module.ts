/** Angular Imports */
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Not Found Component
import { NotFoundComponent } from './not-found/not-found.component';

const routes: Routes = [
  {
    path: 'multi-currency',
    loadChildren: () => import('./mcurrency/mcurrency.module').then(m => m.McurrencyModule)
  },
  {
    path: '',
    redirectTo: '/multi-currency/configuration', // Default redirect
    pathMatch: 'full'
  },
  {
    path: '**',
    component: NotFoundComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule],
  providers: []
})
export class AppRoutingModule { }
