import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { SpinnerService } from '../../shared/services/spinner.service';
import { finalize, switchMap } from 'rxjs/operators';
import { timer } from 'rxjs';

export const httpInterceptor: HttpInterceptorFn = (req, next) => {
  const spinnerService = inject(SpinnerService);

  spinnerService.show();

  return timer(3000).pipe(
    // Delay the request by 10 seconds
    switchMap(() => next(req)), // Execute the HTTP request after the delay
    finalize(() => spinnerService.hide()) // Hide the spinner after the request completes
  );
};
