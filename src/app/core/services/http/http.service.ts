import { HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { EMPTY, Observable, catchError, map, retry, take, throwError } from 'rxjs';

import { environment } from '@env/environment';
import { SpinService } from '@store/common-store/spin.service';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { NzMessageService } from 'ng-zorro-antd/message';

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  private http: HttpClient = inject(HttpClient);
  private message: NzMessageService = inject(NzMessageService);
  private spinService: SpinService = inject(SpinService);

  private readonly APIUrl: string;

  constructor() {
    this.APIUrl = environment.API_URL;
  }

  private getUrl(path: string, otherUrl: boolean): string {
    return otherUrl ? path : this.APIUrl + path;
  }

  // Http Options
  httpOptions = {
    headers: new HttpHeaders({
      'Content-type': 'application/json; charset=UTF-8'
    })
  };

  // Handle API errors
  public handleHttpError(error: HttpErrorResponse): Observable<NzSafeAny> {
    console.error('HTTP_ERROR: ', error, error.status);

    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else if (error instanceof HttpErrorResponse) {
      // The backend returned an unsuccessful response code.
      console.error(`Backend returned code ${error.status}, body was: ${error.error}`);
    }
    // return an observable with a user-facing error message
    return throwError(() => new HttpErrorResponse({ error: error.type, status: error.status, statusText: error.message }));
  }

  public handleHttpResponse<T>(): (observable: Observable<T>) => Observable<T> {
    return (observable: Observable<T>) =>
      observable.pipe(
        take(1),
        retry(2),
        map((response: T) => {
          console.warn('HTTP_RESPONSE: ', response);
          return response;
        }),
        catchError(error => {
          this.spinService.setCurrentGlobalSpinStore(false);
          return this.handleHttpError(error);
        })
      );
  }

  get(endpoint: string, otherUrl: boolean = false): Observable<Object> {
    const url = this.getUrl(endpoint, otherUrl);
    return this.http.get(url, this.httpOptions).pipe(this.handleHttpResponse());
  }

  post(endpoint: string, body: NzSafeAny, otherUrl: boolean = false): Observable<Object> {
    const url = this.getUrl(endpoint, otherUrl);
    return this.http.post(url, body, this.httpOptions).pipe(this.handleHttpResponse());
  }

  put(endpoint: string, body: NzSafeAny, otherUrl: boolean = false): Observable<Object> {
    const url = this.getUrl(endpoint, otherUrl);
    return this.http.put(url, body, this.httpOptions).pipe(this.handleHttpResponse());
  }
}
