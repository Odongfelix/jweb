/** Angular Imports */
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';

/** rxjs Imports */
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

/** Custom Services */
import { ProgressBarService } from '../progress-bar/progress-bar.service';

/**
 * Shell component.
 */
@Component({
  selector: 'mifosx-shell',
  templateUrl: './shell.component.html',
  styleUrls: ['./shell.component.scss']
})
export class ShellComponent implements OnInit, OnDestroy {

  /** Subscription to breakpoint observer for handset. */
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches)
    );
  /** Sets the initial state of sidenav as collapsed. Not collapsed if false. */
  sidenavCollapsed = true;
  /** Progress bar mode. */
  progressBarMode: string;
  /** Subscription to progress bar. */
  progressBar$: Subscription;

  /**
   * @param {BreakpointObserver} breakpointObserver Breakpoint Observer to detect screen size.
   * @param {ProgressBarService} progressBarService Progress Bar Service.
   * @param {ChangeDetectorRef} cdr Change Detector Ref.
   */
  constructor(private breakpointObserver: BreakpointObserver,
              private progressBarService: ProgressBarService,
              private cdr: ChangeDetectorRef) { }

  /**
   * Subscribes to progress bar to update its mode.
   */
  ngOnInit() {
    this.progressBar$ = this.progressBarService.updateProgressBar.subscribe((mode: string) => {
      this.progressBarMode = mode;
      this.cdr.detectChanges();
    });
  }

  /**
   * Toggles the current collapsed state of sidenav according to the emitted event.
   * @param {boolean} event denotes state of sidenav
   */
  toggleCollapse($event: boolean) {
    this.sidenavCollapsed = $event;
    this.cdr.detectChanges();
  }

  /**
   * Safe method to handle breadcrumb-related operations
   * ADDED: New method to prevent undefined errors
   * @param breadcrumbs Array of breadcrumbs
   * @returns Safely processed breadcrumbs
   */
  safeBreadcrumbHandler(breadcrumbs: any[] | undefined): any[] {
    // If breadcrumbs is undefined or not an array, return an empty array
    if (!breadcrumbs || !Array.isArray(breadcrumbs)) {
      return [];
    }

    // Filter out any undefined or null breadcrumbs
    return breadcrumbs.filter(breadcrumb =>
      breadcrumb &&
      (breadcrumb.label !== undefined && breadcrumb.label !== null)
    ).map(breadcrumb => ({
      // Ensure each breadcrumb has a valid label and url
      label: breadcrumb.label || '',
      url: breadcrumb.url || null
    }));
  }

  /**
   * Enhanced version of toggleCollapse to handle breadcrumb-related issues
   * @param event boolean or breadcrumb-related event
   */
  enhancedToggleCollapse(event: any) {
    // If event is a boolean, handle sidenav collapse
    if (typeof event === 'boolean') {
      this.sidenavCollapsed = event;
    }
    // If event might be breadcrumb-related, use safe handler
    else if (event && event.breadcrumbs) {
      const safeBreadcrumbs = this.safeBreadcrumbHandler(event.breadcrumbs);
      // Additional logic if needed
    }

    // Ensure change detection
    this.cdr.detectChanges();
  }

  /**
   * Unsubscribes from progress bar.
   */
  ngOnDestroy() {
    if (this.progressBar$) {
      this.progressBar$.unsubscribe();
    }
  }
}
