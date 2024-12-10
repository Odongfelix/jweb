import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { FormBuilder, FormGroup } from '@angular/forms';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { UntypedFormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { catchError, tap } from 'rxjs/operators';
import { throwError } from 'rxjs';

import { AccountingService } from '../../accounting/accounting.service';
import { SettingsService } from '../../settings/settings.service';
import { Dates } from '../../core/utils/dates';

interface JournalEntryReport {
  date: string;
  office: string;
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
    'office',
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

  // Logo configuration
  private readonly LOGO_PATH = '/assets/images/RL JAIN LOGO2_.png'; // Adjust this path
  private readonly LOGO_WIDTH = 30;
  private readonly LOGO_HEIGHT = 30;

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

    // Get selected office name
    const selectedOffice = this.offices.find(office => office.id === formValues.office);
    const officeName = selectedOffice ? selectedOffice.name : 'All Offices';

    // Simulated data loading - replace with actual service method
    const mockReportData: JournalEntryReport[] = [
      {
        date: new Date().toLocaleDateString(),
        office: officeName,
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
   * Export data to PDF with logo
   */
  exportToPDF(): void {
    if (!this.dataSource || this.dataSource.data.length === 0) {
      alert('No data to export');
      return;
    }

    // Create a new jsPDF instance
    const doc = new jsPDF();

    // Create a promise to handle logo loading
    const loadLogoPromise = new Promise<void>((resolve, reject) => {
      const img = new Image();
      img.src = this.LOGO_PATH;
      img.onload = () => {
        // Add logo to the top left corner
        doc.addImage(
          img,
          'PNG',
          10,  // x position
          10,  // y position
          this.LOGO_WIDTH,  // width
          this.LOGO_HEIGHT  // height
        );
        resolve();
      };
      img.onerror = () => {
        console.warn('Logo failed to load');
        resolve(); // Still resolve to continue PDF generation
      };
    });

    // Continue with PDF generation after logo load
    loadLogoPromise.then(() => {
      // Add a title to the PDF
      const title = `Multi-Currency Entries Report${this.filterForm.get('office').value ?
        ` - ${this.offices.find(o => o.id === this.filterForm.get('office').value)?.name}` :
        ''}`;
      doc.setFontSize(18);
      doc.text(title, 50, 22); // Adjusted x-position to make room for logo

      // Add filter information
      const fromDate = this.filterForm.get('fromDate').value ?
        new Date(this.filterForm.get('fromDate').value).toLocaleDateString() : 'N/A';
      const toDate = this.filterForm.get('toDate').value ?
        new Date(this.filterForm.get('toDate').value).toLocaleDateString() : 'N/A';

      doc.setFontSize(10);
      doc.text(`From Date: ${fromDate}`, 50, 30);
      doc.text(`To Date: ${toDate}`, 50, 36);

      // Prepare data for the table
      const tableColumn = [
        'Date',
        'Office',
        'Debit Account',
        'Credit Account',
        'Debit USD',
        'Credit USD',
        'Conversion Rate',
        'Debit UGX',
        'Credit UGX'
      ];

      const tableRows = this.dataSource.data.map(entry => [
        entry.date,
        entry.office,
        entry.debitAccount,
        entry.creditAccount,
        entry.debitUSD.toLocaleString('en-US', { style: 'currency', currency: 'USD' }),
        entry.creditUSD.toLocaleString('en-US', { style: 'currency', currency: 'USD' }),
        entry.conversionRate.toString(),
        entry.debitUGX.toLocaleString('en-US', { style: 'currency', currency: 'UGX' }),
        entry.creditUGX.toLocaleString('en-US', { style: 'currency', currency: 'UGX' })
      ]);

      // Add the table to the PDF
      (doc as any).autoTable({
        head: [tableColumn],
        body: tableRows,
        startY: 45,
        styles: {
          fontSize: 8,
          cellPadding: 2
        },
        columnStyles: {
          0: { cellWidth: 20 },
          1: { cellWidth: 25 }
        }
      });

      // Generate the PDF
      const fileName = `journal_entries_report_${new Date().toISOString().split('T')[0]}.pdf`;
      doc.save(fileName);
    });
  }

  /**
   * Print current report
   */
  printReport(): void {
    window.print();
  }
}
