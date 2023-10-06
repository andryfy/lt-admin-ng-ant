import { Injectable, inject } from '@angular/core';

import { LoginInOutService } from '@core/services/common/login-in-out.service';

import { AuthService } from '../services/common/auth.service';
import { ModuleService } from '../services/common/module.service';
import { WindowService } from '../services/common/window.service';

@Injectable({
  providedIn: 'root'
})
export class StartupService {
  private authService: AuthService = inject(AuthService);
  private moduleService: ModuleService = inject(ModuleService);

  load(): Promise<void> {
    const userData = this.authService.userStorage;
    if (!!userData) {
      return this.moduleService.setModuleOptionByUserRole(userData.role).then(() => {
        console.warn('Set module option on startup');
      });
    }
    return new Promise(resolve => {
      return resolve();
    });
  }
}
