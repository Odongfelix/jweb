import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { FormBuilder, FormGroup } from '@angular/forms';
import * as XLSX from 'xlsx';

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

@Component({
  selector: 'mifosx-reporting',
  templateUrl: './reporting.component.html',
  styleUrls: ['./reporting.component.scss']
})
export class ReportingComponent implements OnInit {
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

  // Filtering options
  offices: string[] = []; // Populate from backend

  // Pagination and sorting
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  // Loading and error states
  isLoading = false;
  errorMessage: string | null = null;

  constructor(
    private http: HttpClient,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    // Initialize filter form
    this.initFilterForm();

    // Fetch initial data
    this.fetchOffices();
    this.loadReportData();
  }

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

  fetchOffices(): void {
    this.http.get<string[]>('/api/offices')
      .subscribe(
        offices => this.offices = offices,
        error => {
          console.error('Error fetching offices:', error);
          this.errorMessage = 'Unable to load offices';
        }
      );
  }

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

    this.http.get<JournalEntryReport[]>('/api/journal-entries/report', { params })
      .subscribe(
        data => {
          // Transform date strings to Date objects for better display
          const transformedData = data.map(entry => ({
            ...entry,
            date: new Date(entry.date).toLocaleDateString()
          }));

          this.dataSource = new MatTableDataSource(transformedData);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          this.isLoading = false;
        },
        error => {
          console.error('Error fetching report data:', error);
          this.errorMessage = 'Unable to load journal entry report';
          this.isLoading = false;
        }
      );
  }

  // Reset filters
  resetFilters(): void {
    this.filterForm.reset();
  }

  // Export methods remain the same as in previous implementation
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

  printReport(): void {
    window.print();
  }
}
