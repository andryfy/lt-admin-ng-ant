import { HttpClient, HttpEvent, HttpEventType, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { DestroyRef, inject, Injectable, NgZone } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { filter, finalize, share, switchMap } from 'rxjs/operators';

import { TokenKey, loginTimeOutCode, tokenErrorCode } from '@config/constant';
import { LoginInOutService } from '@core/services/common/login-in-out.service';
import { ModalBtnStatus } from '@widgets/base-modal';
import { LoginModalService } from '@widgets/biz-widget/login/login-modal.service';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { NzMessageService } from 'ng-zorro-antd/message';

import { WindowService } from '../common/window.service';

@Injectable()
export class LoginExpiredService implements HttpInterceptor {
  private refresher: Observable<NzSafeAny> | null = null;
  destroyRef = inject(DestroyRef);

  constructor(
    private loginModalService: LoginModalService,
    private router: Router,
    private loginInOutService: LoginInOutService,
    private zone: NgZone,
    private message: NzMessageService,
    private windowServe: WindowService,
    private http: HttpClient
  ) {}

  intercept(req: HttpRequest<string>, next: HttpHandler): Observable<HttpEvent<NzSafeAny>> {
    const newReq = req.clone();
    return next.handle(newReq).pipe(
      filter(e => e.type !== 0),
      this.loginExpiredFn(newReq, next)
    );
  }

  private sendRequest(request: HttpRequest<NzSafeAny>, next: HttpHandler): Observable<NzSafeAny> | null {
    return this.refresher!.pipe(
      switchMap(() => {
        const token = this.windowServe.getSessionStorage(TokenKey);
        let httpConfig = {};
        if (!!token) {
          httpConfig = { headers: request.headers.set(TokenKey, token) };
        }
        this.refresher = null;
        const copyReq = request.clone(httpConfig);
        return next.handle(copyReq).pipe(finalize(() => (this.refresher = null)));
      }),
      finalize(() => (this.refresher = null))
    );
  }

  private loginOut(): void {
    this.loginInOutService.loginOut();
    this.refresher = null;
    this.router.navigateByUrl('/login/login-form');
  }

  // Login expiration interception
  private loginExpiredFn(req: HttpRequest<string>, next: HttpHandler): NzSafeAny {
    return switchMap((event: HttpResponse<NzSafeAny>): NzSafeAny => {
      if (event.type !== HttpEventType.Response || event.body.code !== loginTimeOutCode) {
        return of(event);
      }
      if (event.body.code === tokenErrorCode) {
        this.loginOut();
        return;
      }

      if (this.refresher) {
        return this.sendRequest(req, next);
      }

      this.refresher = new Observable(observer => {
        // setTimeout is used to solve the problem that when refreshing the page, the login dialog box will flash because the zorro style is not loaded.
        setTimeout(() => {
          this.loginModalService
            .show({ nzTitle: '登录信息过期，重新登录' })
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(({ modalValue: token, status }) => {
              if (status === ModalBtnStatus.Cancel) {
                // This is done so that the token expires when logged in. Refresh the page and click Cancel on the login window. This needs to be completed through the interface for getting the menu in startUp.,
                // Otherwise, you cannot enter the angular application and the route will not jump.
                observer.next(
                  new HttpResponse({
                    body: {
                      code: 3013,
                      msg: 'Please log in again after canceling',
                      data: null
                    }
                  })
                );
                this.loginOut();
                return;
              }
              this.loginInOutService.loginIn(token).then();
              this.http
                .request(req)
                .pipe(takeUntilDestroyed(this.destroyRef))
                .subscribe({
                  next: (data: NzSafeAny) => {
                    this.refresher = null;
                    observer.next(data);
                  },
                  error: () => {
                    // If you use admin to log in to the system first, the login box pops up when the token times out, but the normal account is logged in at this time, and there is no authority for the target page, then return to the login page
                    // Here, the backend judges that the new token has no authority, and the request reports an error 403
                    this.message.error('You do not have permission to log in to this module');
                    this.loginOut();
                  }
                });
            });
        }, 100);
      }).pipe(
        share(),
        finalize(() => (this.refresher = null))
      );
      return this.refresher;
    });
  }
}
