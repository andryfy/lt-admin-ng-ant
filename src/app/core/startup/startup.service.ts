import { Injectable, inject } from '@angular/core';

import { TokenKey, TokenPrefix } from '@config/constant';
import { LoginInOutService } from '@core/services/common/login-in-out.service';

import { WindowService } from '../services/common/window.service';

@Injectable({
  providedIn: 'root'
})
export class StartupService {
  private windowService: WindowService = inject(WindowService);
  private loginInOutService: LoginInOutService = inject(LoginInOutService);

  load(): Promise<void> {
    const token: string = this.windowService.getSessionStorage(TokenKey)?.replace(TokenPrefix, '') as string;
    if (!!token) {
      return this.loginInOutService.loginIn(token);
    }
    return new Promise(resolve => {
      return resolve();
    });
  }
}
