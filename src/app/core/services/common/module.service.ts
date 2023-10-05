import { DestroyRef, Inject, Injectable, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Observable, finalize, of } from 'rxjs';

import { MODULE_TOKEN } from '@app/config';
import { ModuleOptionKey, ThemeOptionKey } from '@app/config/constant';
import { WindowService } from '@app/core/services/common/window.service';
import { InitThemeService } from '@core/services/common/init-theme.service';
import { ThemeService } from '@store/common-store/theme.service';

import { MenuService } from './menu.service';
import { ModuleOption } from '../types';

export interface ModuleOptionStore {
  code: string;
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class ModuleService {
  public destroyRef = inject(DestroyRef);
  private windowServicevice: WindowService = inject(WindowService);
  private initthemeService: InitThemeService = inject(InitThemeService);
  private themeService: ThemeService = inject(ThemeService);
  private menuService: MenuService = inject(MenuService);

  constructor(@Inject(MODULE_TOKEN) public moduleList: ModuleOption[]) {}

  public getModuleByUserRole(userRole: string): Observable<ModuleOption> {
    // Load from types
    return of(this.moduleList.find(module => module.code === userRole)) as Observable<ModuleOption>;
  }

  public setModuleOptionByUserRole(userRole: string): Promise<void> {
    return new Promise(resolve => {
      // Get the module owned by this user through the user role
      this.getModuleByUserRole(userRole)
        .pipe(
          finalize(() => {
            resolve();
          }),
          takeUntilDestroyed(this.destroyRef)
        )
        .subscribe((module: ModuleOption) => {
          console.warn('Module: ', module);

          // Set ModuleOption config in storage
          const moduleOptionStore: ModuleOptionStore = {
            code: module.code,
            name: module.name
          };
          this.setModuleOptionStorage(moduleOptionStore).then(() => {
            this.initthemeService.initTheme().then();
          });

          // Set ThemeOption config in storage
          this.themeService.setThemeOptionStorage(module.theme);

          // Set the menu for user
          this.menuService.setNavMenu(module.menuList).then();
          resolve();
        });
    });
  }

  public get moduleOptionStorage(): ModuleOptionStore {
    const moduleOption: ModuleOptionStore = JSON.parse(this.windowServicevice.getStorage(ModuleOptionKey) as string);
    console.warn('ModuleOption: ', moduleOption);
    return moduleOption;
  }

  public setModuleOptionStorage(moduleOption: ModuleOptionStore): Promise<void> {
    return new Promise(resolve => {
      this.removeModuleOptionStorage();
      this.windowServicevice.setStorage(ModuleOptionKey, JSON.stringify(moduleOption));
      return resolve();
    });
  }

  public removeModuleOptionStorage(): void {
    this.windowServicevice.removeStorage(ModuleOptionKey);
  }
}
