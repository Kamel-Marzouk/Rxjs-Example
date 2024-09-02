import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SpinnerService {
  loading: boolean = false;

  constructor() { }

  /** Sets true value to loading variable. */
  show(): void {
    this.loading = true;
  }

  /** Sets false value to loading variable. */
  hide(): void {
    this.loading = false;
  }
}
