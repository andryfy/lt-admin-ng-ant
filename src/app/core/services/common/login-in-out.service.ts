import { DestroyRef, inject, Injectable } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { ActionCode } from '@config/actionCode';
import { TokenKey, TokenPrefix } from '@config/constant';
import { SimpleReuseStrategy } from '@core/services/common/reuse-strategy';
import { TabService } from '@core/services/common/tab.service';
import { WindowService } from '@core/services/common/window.service';
import { MenuOption } from '@core/services/types';
import { LoginService } from '@http/login/login.service';
import { MenuStoreService } from '@store/common-store/menu-store.service';
import { UserInfo, UserInfoService } from '@store/common-store/userInfo.service';
import { fnFlatDataHasParentToTree } from '@utils/treeTableTools';

/*
 * sign out
 * */
@Injectable({
  providedIn: 'root'
})
export class LoginInOutService {
  destroyRef = inject(DestroyRef);

  constructor(
    private activatedRoute: ActivatedRoute,
    private tabService: TabService,
    private loginService: LoginService,
    private router: Router,
    private userInfoService: UserInfoService,
    private menuService: MenuStoreService,
    private windowService: WindowService
  ) {}

  // Get the menu array by user ID
  getMenuByUserId(userId: number): Observable<MenuOption[]> {
    return this.loginService.getMenuByUserId(userId);
  }

  loginIn(token: string): Promise<void> {
    return new Promise(resolve => {
      // Cache the token persistently. Please note that if there is no cache, it will be intercepted in the route guard and the route will not be allowed to jump.
      // This route is guarded at src/app/core/services/common/guard/judgeLogin.guard.ts
      this.windowService.setSessionStorage(TokenKey, TokenPrefix + token);
      // Parse the token and get user information
      const userInfo: UserInfo = this.userInfoService.parseToken(TokenPrefix + token);
      // TODO: Here is the permission to manually add the button to open the details in the static page tab operation, because they involve routing jumps, and they will be guarded by walking, but the permissions are not managed by the backend, so the following two lines manually add permissions,
      // In actual operation, you can delete the following 2 lines
      userInfo.authCode.push(ActionCode.TabsDetail);
      userInfo.authCode.push(ActionCode.SearchTableDetail);
      // Cache user information into the global service
      this.userInfoService.setUserInfo(userInfo);
      // Get the menu owned by this user through the user id
      this.getMenuByUserId(userInfo.userId)
        .pipe(
          finalize(() => {
            resolve();
          }),
          takeUntilDestroyed(this.destroyRef)
        )
        .subscribe(menus => {
          menus = menus.filter(item => {
            item.selected = false;
            item.open = false;
            return item.menuType === 'C';
          });
          const temp = fnFlatDataHasParentToTree(menus);
          // Storage menu
          this.menuService.setMenuArrayStore(temp);
          resolve();
        });
    });
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
      this.windowService.removeSessionStorage(TokenKey);
      this.menuService.setMenuArrayStore([]);
      resolve();
    });
  }

  loginOut(): Promise<void> {
    return this.clearTabCash()
      .then(() => {
        return this.clearSessionCash();
      })
      .then(() => {
        this.router.navigate(['/login/login-form']);
      });
  }
}
