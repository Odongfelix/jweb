import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { FormBuilder, FormGroup } from '@angular/forms';
import * as XLSX from 'xlsx';
import { UntypedFormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { catchError, tap } from 'rxjs/operators';
import { throwError } from 'rxjs';

import { AccountingService } from '../../accounting/accounting.service';
import { SettingsService } from '../../settings/settings.service';
import { Dates } from '../../core/utils/dates';

interface JournalEntryReport {
  date: string;
  debitAccount: string;
  creditAccount: string;
  debitUSD: number;
  creditUSD: number;
  conversionRate: number;
  debitUGX: number;
  creditUGX: number;
}

interface Office {
  id: number;
  name: string;
}

@Component({
  selector: 'mifosx-reporting',
  templateUrl: './reporting.component.html',
  styleUrls: ['./reporting.component.scss']
})
export class ReportingComponent implements OnInit {
  /** Minimum transaction date allowed. */
  minDate = new Date(2000, 0, 1);
  /** Maximum transaction date allowed. */
  maxDate = new Date();

  /** Office data. */
  offices: Office[] = [];

  /** Gl Account data. */
  glAccounts: any[] = [];

  // Table configuration
  displayedColumns: string[] = [
    'date',
    'debitAccount',
    'creditAccount',
    'debitUSD',
    'creditUSD',
    'conversionRate',
    'debitUGX',
    'creditUGX'
  ];
  dataSource: MatTableDataSource<JournalEntryReport>;

  // Form for filtering
  filterForm: FormGroup;

  // Pagination and sorting
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  // Loading and error states
  isLoading = false;
  errorMessage: string | null = null;

  constructor(
    private accountingService: AccountingService,
    private settingsService: SettingsService,
    private dateUtils: Dates,
    private fb: FormBuilder,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Initialize filter form
    this.initFilterForm();

    // Fetch offices
    this.fetchOffices();

    // Load initial report data
    this.loadReportData();
  }

  /**
   * Initialize filter form with default values
   */
  initFilterForm(): void {
    this.filterForm = this.fb.group({
      fromDate: [null],
      toDate: [null],
      office: [null]
    });

    // Subscribe to form value changes to trigger data reload
    this.filterForm.valueChanges.subscribe(() => {
      this.loadReportData();
    });
  }

  /**
   * Fetch offices from the backend
   */
  fetchOffices(): void {
    this.isLoading = true;
    this.errorMessage = null;

    this.accountingService.getOffices().pipe(
      tap(offices => {
        this.offices = offices || [];
        this.isLoading = false;
      }),
      catchError(error => {
        console.error('Error fetching offices:', error);
        this.errorMessage = 'Unable to load offices';
        this.isLoading = false;
        return throwError(error);
      })
    ).subscribe();
  }

  /**
   * Load report data based on filter criteria
   */
  loadReportData(): void {
    this.isLoading = true;
    this.errorMessage = null;

    // Prepare query parameters
    const formValues = this.filterForm.value;
    const params: any = {};

    // Convert dates to ISO string if they exist
    if (formValues.fromDate) {
      params.fromDate = new Date(formValues.fromDate).toISOString();
    }
    if (formValues.toDate) {
      params.toDate = new Date(formValues.toDate).toISOString();
    }
    if (formValues.office) {
      params.office = formValues.office;
    }

    // Simulated data loading - replace with actual service method
    const mockReportData: JournalEntryReport[] = [
      {
        date: new Date().toLocaleDateString(),
        debitAccount: 'Cash Account',
        creditAccount: 'Revenue Account',
        debitUSD: 1000,
        creditUSD: 1000,
        conversionRate: 1,
        debitUGX: 3700000,
        creditUGX: 3700000
      }
    ];

    // Create data source
    this.dataSource = new MatTableDataSource(mockReportData);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.isLoading = false;

    // TODO: Uncomment and implement actual API call
    // this.accountingService.getJournalEntryReport(params)
    //   .pipe(
    //     tap(data => {
    //       const transformedData = data.map(entry => ({
    //         ...entry,
    //         date: new Date(entry.date).toLocaleDateString()
    //       }));
    //
    //       this.dataSource = new MatTableDataSource(transformedData);
    //       this.dataSource.paginator = this.paginator;
    //       this.dataSource.sort = this.sort;
    //       this.isLoading = false;
    //     }),
    //     catchError(error => {
    //       console.error('Error fetching report data:', error);
    //       this.errorMessage = 'Unable to load journal entry report';
    //       this.isLoading = false;
    //       return throwError(error);
    //     })
    //   ).subscribe();
  }

  /**
   * Reset all filters
   */
  resetFilters(): void {
    this.filterForm.reset();
  }

  /**
   * Export data to CSV
   */
  exportToCSV(): void {
    if (!this.dataSource || this.dataSource.data.length === 0) {
      alert('No data to export');
      return;
    }

    const worksheet = XLSX.utils.json_to_sheet(this.dataSource.data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Journal Entries');

    const fileName = `journal_entries_report_${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(workbook, fileName);
  }

  /**
   * Print current report
   */
  printReport(): void {
    window.print();
  }
}
