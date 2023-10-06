import { Injectable, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, catchError, map, throwError } from 'rxjs';

import { ENDPOINTS_API, ENDPOINTS_APP } from '@app/config/endpoint';
import { ENV } from '@app/config/env';
import { JwtHelperService } from '@auth0/angular-jwt';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { NzMessageService } from 'ng-zorro-antd/message';

import { ModuleService } from './module.service';
import { SimpleReuseStrategy } from './reuse-strategy';
import { TabService } from './tab.service';
import { WindowService } from './window.service';
import { HttpService } from '../http/http.service';
import { User } from '../http/system/account.service';
import { MenuStoreService } from '../store/common-store/menu-store.service';
import { OptionInterface } from '../types';

export interface UserCredential {
  username: string;
  password: string;
}

export interface UserInfo {
  username: string;
  role: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  private tabService: TabService = inject(TabService);
  private router: Router = inject(Router);
  private windowService: WindowService = inject(WindowService);
  private menuStoreService: MenuStoreService = inject(MenuStoreService);
  private moduleService: ModuleService = inject(ModuleService);
  private message: NzMessageService = inject(NzMessageService);
  private httpService: HttpService = inject(HttpService);

  signIn(userCredential: UserCredential): Observable<boolean | Promise<boolean>> {
    return this.httpService.post(ENDPOINTS_API.login, userCredential).pipe(
      map((response: NzSafeAny) => {
        console.warn('Login response: ', response);
        // login successful if there's a jwt token in the response
        if (!!response && !!response.token) {
          this.moduleService.setModuleOptionByUserRole('default').then(() => {
            // store user details and jwt token in local storage to keep user logged in between page refreshes
            const token: string = response.token;
            this.setTokenStorage(token);
            const helper = new JwtHelperService();
            const decodedToken = helper.decodeToken(token);
            const user: UserInfo = {
              username: decodedToken.user,
              role: 'default'
            };
            this.setUserStorage(user);

            this.message.success('Bienvenue, vous êtes connécté', {
              nzDuration: 10000
            });
            return this.router.navigate([ENDPOINTS_APP.home]);
          });
        } else {
          this.handleAccessDenied();
        }
        return false;
      }),
      catchError(error => {
        console.error('Login error: ', error);
        if (error.status >= 400 && error.status < 500) {
          this.handleAccessDenied();
        }
        return throwError(() => new Error(error));
      })
    );
  }

  handleAccessDenied(): boolean {
    this.message.error('Identifiant ou mot de passe incorrect!', {
      nzDuration: 10000
    });
    return false;
  }

  signOut(): Promise<void> {
    // remove user from local storage and set current user to null
    // this.userSubject.next(null);
    return this.clearTabCash()
      .then(() => {
        return this.clearSessionCash();
      })
      .then(() => {
        this.router.navigate([ENDPOINTS_APP.login]);
      });
  }

  relogin(): Observable<any> {
    throw new Error('Method not implemented.');
  }

  // Returns true when user is looged in and email is verified
  get isLoggedIn(): boolean {
    const user: UserInfo = this.userStorage;
    return !!user;
  }

  get tokenStorage(): string {
    return this.windowService.getStorage(ENV.user.TOKEN_KEY) as string;
  }

  setTokenStorage(token: string): void {
    this.removeTokenStorage();
    this.windowService.setStorage(ENV.user.TOKEN_KEY, token);
  }

  removeTokenStorage(): void {
    this.windowService.removeStorage(ENV.user.TOKEN_KEY);
  }

  get userStorage(): UserInfo {
    const user: UserInfo = JSON.parse(this.windowService.getStorage(ENV.user.USER_KEY) as string);
    console.warn('User: ', user);
    return user;
  }

  setUserStorage(user: UserInfo): void {
    this.removeUserStorage();
    this.windowService.setStorage(ENV.user.USER_KEY, JSON.stringify(user));
  }

  removeUserStorage(): void {
    this.windowService.removeStorage(ENV.user.USER_KEY);
  }

  get refreshTokenStorage(): string {
    throw new Error('Method not implemented.');
  }

  // Clearing the Tab cache is something related to route reuse.
  clearTabCash(): Promise<void> {
    return SimpleReuseStrategy.deleteAllRouteSnapshot(this.activatedRoute.snapshot).then(() => {
      return new Promise(resolve => {
        // clear tab
        this.tabService.clearTabs();
        resolve();
      });
    });
  }

  clearSessionCash(): Promise<void> {
    return new Promise(resolve => {
      this.removeTokenStorage();
      this.removeUserStorage();
      this.moduleService.removeModuleOptionStorage();
      this.menuStoreService.setMenuArrayStore([]);
      resolve();
    });
  }
}
