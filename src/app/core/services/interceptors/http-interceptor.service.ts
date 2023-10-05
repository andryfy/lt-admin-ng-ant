import { HttpErrorResponse, HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, filter } from 'rxjs/operators';

import { TokenKey } from '@config/constant';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { NzMessageService } from 'ng-zorro-antd/message';

import { WindowService } from '../common/window.service';

interface CustomHttpConfig {
  headers?: HttpHeaders;
}

@Injectable()
export class HttpInterceptorService implements HttpInterceptor {
  constructor(private windowServicevice: WindowService, public message: NzMessageService) {}

  intercept(req: HttpRequest<NzSafeAny>, next: HttpHandler): Observable<HttpEvent<NzSafeAny>> {
    const token = this.windowServicevice.getSessionStorage(TokenKey);
    let httpConfig: CustomHttpConfig = {};
    if (!!token) {
      httpConfig = { headers: req.headers.set(TokenKey, token) };
    }
    const copyReq = req.clone(httpConfig);
    return next.handle(copyReq).pipe(
      filter(e => e.type !== 0),
      catchError(error => this.handleError(error))
    );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    const status = error.status;
    let errMsg = '';
    if (status === 0) {
      errMsg = 'An unknown error occurred on the network, please check your network.';
    }
    if (status >= 300 && status < 400) {
      errMsg = `The request was redirected by the server with the status code ${status}`;
    }
    if (status >= 400 && status < 500) {
      errMsg = `An error occurred on the client side. It may be that the data sent is incorrect. The status code is ${status}`;
    }
    if (status >= 500) {
      errMsg = `A server error occurred, the status code is ${status}`;
    }

    return throwError(() => {
      return {
        code: status,
        message: errMsg
      };
    });
  }
}
