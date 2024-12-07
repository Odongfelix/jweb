/** Angular Imports */
import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';

/** rxjs Imports */
import { Observable } from 'rxjs';

/** Custom Services */
import { McurrencyService } from '../mcurrency.service';

/**
 * Offices data resolver.
 */
@Injectable()
export class OfficesResolver implements Resolve<Object> {

  /**
   * @param {AccountingService} accountingService Accounting service.
   */
  constructor(private accountingService: McurrencyService) {}

  /**
   * Returns the offices data.
   * @returns {Observable<any>}
   */
  resolve(): Observable<any> {
    return this.accountingService.getOffices();
  }

}
