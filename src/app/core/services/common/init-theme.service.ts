import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { first } from 'rxjs/operators';

import { IsNightKey, ThemeOptionKey } from '@config/constant';
import { ThemeService } from '@store/common-store/theme.service';
import { NzSafeAny } from 'ng-zorro-antd/core/types';

import { WindowService } from './window.service';

type setThemeProp = 'setIsNightTheme' | 'setThemeMode';
type getThemeProp = 'getIsNightTheme' | 'getThemeMode';

interface ThemeInitOption {
  storageKey: string;
  setMethodName: setThemeProp;
  getMethodName: getThemeProp;
}

/*
 * Initialize theme
 * */
@Injectable({
  providedIn: 'root'
})
export class InitThemeService {
  themeInitOption: ThemeInitOption[] = [
    {
      storageKey: IsNightKey,
      setMethodName: 'setIsNightTheme',
      getMethodName: 'getIsNightTheme'
    },
    {
      storageKey: ThemeOptionKey,
      setMethodName: 'setThemeMode',
      getMethodName: 'getThemeMode'
    }
  ];

  constructor(private themeService: ThemeService, private windowServicevice: WindowService) {}

  initTheme(): Promise<void> {
    return new Promise(resolve => {
      this.themeInitOption.forEach(item => {
        const hasCash = this.windowServicevice.getStorage(item.storageKey);
        if (hasCash) {
          this.themeService[item.setMethodName](JSON.parse(hasCash));
        } else {
          (this.themeService[item.getMethodName]() as Observable<NzSafeAny>).pipe(first()).subscribe(res => this.windowServicevice.setStorage(item.storageKey, JSON.stringify(res)));
        }
      });
      return resolve();
    });
  }
}
