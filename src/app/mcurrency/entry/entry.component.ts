import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'mifosx-entry',
  templateUrl: './entry.component.html',
  styleUrls: ['./entry.component.scss']
})
export class EntryComponent implements OnInit {
  entryForm: FormGroup;
  conversionRate: number | null = null;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.fetchConversionRate();
  }

  initForm(): void {
    this.entryForm = this.fb.group({
      office: ['', Validators.required],
      currency: ['USD', Validators.required],
      debitGlAccount: ['', Validators.required],
      debitAmount: ['', [Validators.required, Validators.min(0)]],
      creditGlAccount: ['', Validators.required],
      creditAmount: ['', [Validators.required, Validators.min(0)]],
      referenceNumber: [''],
      transactionDate: ['', Validators.required],
      paymentType: [''],
      accountNumber: [''],
      chequeNumber: [''],
      routingCode: [''],
      receiptNumber: [''],
      bankNumber: [''],
      comments: ['']
    });
  }

  fetchConversionRate(): void {
    this.http.get<{ rate: number, lastUpdated: string }>('/api/mcurrency/today')
      .subscribe(
        response => {
          this.conversionRate = response.rate;
        },
        error => {
          console.error('Error fetching conversion rate:', error);
        }
      );
  }

  convertUSDtoUGX(amountInUSD: number): number {
    if (!this.conversionRate) {
      throw new Error('Conversion rate not available');
    }
    return amountInUSD * this.conversionRate;
  }

  onSubmit(): void {
    if (this.entryForm.valid) {
      const formValue = this.entryForm.value;

      // If currency is USD, convert to UGX
      if (formValue.currency === 'USD') {
        try {
          // Convert debit amount
          const debitAmountUGX = this.convertUSDtoUGX(formValue.debitAmount);

          // Convert credit amount
          const creditAmountUGX = this.convertUSDtoUGX(formValue.creditAmount);

          // Prepare payload with converted amounts
          const payload = {
            ...formValue,
            debitAmount: debitAmountUGX,
            creditAmount: creditAmountUGX,
            originalCurrency: 'USD',
            conversionRate: this.conversionRate
          };

          // Submit the converted entry
          this.http.post('/api/journal-entries', payload)
            .subscribe(
              response => {
                console.log('Journal entry submitted successfully', response);
                // Handle successful submission (e.g., show success message, reset form)
              },
              error => {
                console.error('Error submitting journal entry', error);
                // Handle submission error
              }
            );
        } catch (error) {
          console.error('Conversion error:', error);
          // Handle conversion error (e.g., show error message to user)
        }
      } else {
        // If not USD, submit directly
        this.http.post('/api/journal-entries', formValue)
          .subscribe(
            response => {
              console.log('Journal entry submitted successfully', response);
            },
            error => {
              console.error('Error submitting journal entry', error);
            }
          );
      }
    }
  }
}
