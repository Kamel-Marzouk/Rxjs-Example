import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Observable, throwError, timer } from 'rxjs';
import { catchError, delay, switchMap } from 'rxjs/operators';

const httpHeaders: HttpHeaders = new HttpHeaders({
  'Content-Type': 'application/json',
});

@Injectable()
export class HttpService {
  private baseURL: string = 'http://localhost:3000';

  constructor(private httpClient: HttpClient) {}

  public getAll(url: string): Observable<any[]> {
    return this.httpClient
      .get<any[]>(this.baseURL + url, { headers: httpHeaders })
      .pipe(catchError(this.handleError));
  }

  // public getAll(url: string): Observable<any[]> {
  //   return timer(10000).pipe(
  //     // Wait for 10 seconds before executing the HTTP request
  //     switchMap(() =>
  //       this.httpClient.get<any[]>(this.baseURL + url, {
  //         headers: httpHeaders,
  //       })
  //     ),
  //     catchError(this.handleError)
  //   );
  // }

  public create(url: string, resources: any): Observable<any> {
    return this.httpClient
      .post<any>(this.baseURL + url, resources, { headers: httpHeaders })
      .pipe(catchError(this.handleError));
  }

  public update(
    url: string,
    id: string | undefined,
    resources: any
  ): Observable<any> {
    return this.httpClient
      .put<any>(this.baseURL + url + '/' + id, resources, {
        headers: httpHeaders,
      })
      .pipe(catchError(this.handleError));
  }

  public getById(url: string, id: string): Observable<any> {
    return this.httpClient
      .get<any>(this.baseURL + url + '/' + id, { headers: httpHeaders })
      .pipe(catchError(this.handleError));
  }

  public delete(url: string, id: string): Observable<any> {
    return this.httpClient
      .delete<any>(this.baseURL + url + '/' + id, { headers: httpHeaders })
      .pipe(catchError(this.handleError));
  }

  /**
   * Handles http error response.
   * @param error The http error response.
   */
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Unknown error!';
    if (error.error instanceof ErrorEvent) {
      // Client-side errors
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side errors
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(errorMessage);
  }
}
