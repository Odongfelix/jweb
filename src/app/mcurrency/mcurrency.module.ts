import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { McurrencyRoutingModule } from './mcurrency-routing.module';
import { McurrencyComponent } from './mcurrency.component';
import { MconfigurationComponent } from './mconfiguration/mconfiguration.component';
import { EntryComponent } from './entry/entry.component';
import { ReportingComponent } from './reporting/reporting.component';
import { FlexModule } from '@angular/flex-layout';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatOptionModule } from '@angular/material/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatTableModule } from '@angular/material/table';
import { MatDividerModule } from '@angular/material/divider';
import { MatPaginatorModule } from '@angular/material/paginator';


@NgModule({
  declarations: [MconfigurationComponent, EntryComponent, ReportingComponent
  ],
  imports: [
    CommonModule,
    McurrencyRoutingModule,
    FlexModule,
    FontAwesomeModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatOptionModule,
    ReactiveFormsModule,
    TranslateModule,
    MatCheckboxModule,
    MatIconModule,
    FormsModule,
    MatSelectModule,
    MatDatepickerModule,
    MatTableModule,
    MatDividerModule,
    MatPaginatorModule
  ]
})
export class McurrencyModule { }
