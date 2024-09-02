import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { SpinnerService } from '../../shared/services/spinner.service';
import { finalize, switchMap } from 'rxjs/operators';
import { timer } from 'rxjs';

export const httpInterceptor: HttpInterceptorFn = (req, next) => {
  const spinnerService = inject(SpinnerService);

  spinnerService.show();

  return timer(1000).pipe(
    switchMap(() => next(req)),
    finalize(() => spinnerService.hide())
  );
};
