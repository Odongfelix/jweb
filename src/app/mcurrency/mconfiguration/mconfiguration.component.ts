import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subscription, timer } from 'rxjs';
import { timeout, catchError } from 'rxjs/operators';

@Component({
  selector: 'mifosx-mconfiguration',
  templateUrl: './mconfiguration.component.html',
  styleUrls: ['./mconfiguration.component.scss']
})
export class MconfigurationComponent implements OnInit {

  useLiveRates: boolean = true;
  manualRate: number | null = null;
  savedRate: number | null = null;
  liveRate: number | null = null;
  lastUpdated: string | null = null;
  canSaveRate: boolean = true;
  isFetchingLiveRate: boolean = false; // Indicates whether the live rate is being fetched
  fetchError: string | null = null; // Holds any error message during live rate fetch

  private apiUrl = '/api/mcurrency';
  private liveRateApiUrl = 'https://api.exchangerate-api.com/v4/latest/USD';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchSavedRate();
    if (this.useLiveRates) {
      this.fetchLiveRate();
    }
  }

  /**
   * Fetches the live exchange rate with timeout and error handling.
   */
  fetchLiveRate(): void {
    this.isFetchingLiveRate = true;
    this.fetchError = null; // Reset error before fetching
    this.http.get<{ rates: { UGX: number } }>(this.liveRateApiUrl)
      .pipe(
        timeout(10000), // Cancel request if it takes more than 10 seconds
        catchError(error => {
          this.fetchError = 'Unable to fetch live rate. Please try again later.';
          console.error('Error fetching live rate:', error);
          throw error;
        })
      )
      .subscribe(
        response => {
          this.liveRate = response.rates.UGX;
          this.lastUpdated = new Date().toISOString();
          this.isFetchingLiveRate = false;
        },
        () => {
          this.isFetchingLiveRate = false;
        }
      );
  }

  /**
   * Fetches the saved rate and last updated time from the backend.
   */
  fetchSavedRate(): void {
    this.http.get<{ rate: number, lastUpdated: string }>(`${this.apiUrl}/today`)
      .subscribe(
        response => {
          this.savedRate = response.rate;
          this.lastUpdated = response.lastUpdated;
          this.canSaveRate = !this.lastUpdated || this.isNewDay(this.lastUpdated);
        },
        error => {
          console.error('Error fetching saved rate:', error);
        }
      );
  }

  toggleRateMode(): void {
    if (this.useLiveRates) {
      this.manualRate = null;
      this.fetchLiveRate();
    }
  }

  saveManualRate(): void {
    if (this.manualRate) {
      const payload = { rate: this.manualRate, date: new Date().toISOString() };
      this.http.post(`${this.apiUrl}/save`, payload)
        .subscribe(() => {
          this.savedRate = this.manualRate;
          this.lastUpdated = payload.date;
          this.canSaveRate = false;
        });
    }
  }

  private isNewDay(lastUpdated: string): boolean {
    const lastUpdateDate = new Date(lastUpdated).toDateString();
    const todayDate = new Date().toDateString();
    return lastUpdateDate !== todayDate;
  }
}
