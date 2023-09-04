import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

// import { LoginType } from '@app/pages/other-login/login1/login1.component';

// This is the store that caches login1 and belongs to the business store.
@Injectable({
  providedIn: 'root'
})
export class Login1StoreService {
  // private loginType$ = new BehaviorSubject<LoginType>(LoginType.Normal);
  private isLogin1OverModel$ = new BehaviorSubject<boolean>(false);

  constructor() {}

  // setLoginTypeStore(type: LoginType): void {
  //   this.loginType$.next(type);
  // }

  // getLoginTypeStore(): Observable<LoginType> {
  //   return this.loginType$.asObservable();
  // }

  setIsLogin1OverModelStore(type: boolean): void {
    this.isLogin1OverModel$.next(type);
  }

  getIsLogin1OverModelStore(): Observable<boolean> {
    return this.isLogin1OverModel$.asObservable();
  }
}
