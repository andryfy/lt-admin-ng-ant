import { assertInInjectionContext, inject } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, CanActivateChildFn, CanActivateFn, Router } from '@angular/router';

import { TokenKey } from '@config/constant';

import { WindowService } from '../window.service';

// If you are interested, you can take a look at the dispute between class and fn https://github.com/angular/angular/pull/47924
// I provide different writing methods from judgeAuth.guard.ts here for your reference. You can also go to the official website to find the mapToCanActivate API.
// Routing guard, if there is no TokenKey, then jump to the login page
const canActivateChildFn: CanActivateFn = () => {
  // This method can check whether the inject is in the context
  assertInInjectionContext(canActivateChildFn);
  const windowSrc = inject(WindowService);
  const router = inject(Router);

  const isLogin = !!windowSrc.getSessionStorage(TokenKey);
  if (isLogin) {
    return true;
  }
  return router.parseUrl('/login');
};

export const JudgeLoginGuard: CanActivateChildFn = (childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  return canActivateChildFn(childRoute, state);
};
