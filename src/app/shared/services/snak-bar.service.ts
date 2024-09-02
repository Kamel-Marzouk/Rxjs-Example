import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class SnackBarService {
  constructor(private snackBar: MatSnackBar) {}

  /**
   * Opens a snackbar with a message and an optional action.
  @param message The message to show in the snackbar.
  @param action The label for the snackbar action.
  @param config Additional configuration options for the snackbar.
   */
  openSnackBar(
    message: string,
    action: string,
    config?: MatSnackBarConfig<any>
  ): void {
    if (!config)
      config = {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'top',
      };
    this.snackBar.open(message, action, config);
  }
}
