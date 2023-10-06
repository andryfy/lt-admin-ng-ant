import { DestroyRef, Inject, Injectable, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { Observable, finalize, of } from 'rxjs';

import { fnFlatDataHasParentToTree } from '@app/utils/treeTableTools';

import { MenuStoreService } from './../store/common-store/menu-store.service';
import { MenuOption } from '../types';

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  private router: Router = inject(Router);
  private menuStoreService: MenuStoreService = inject(MenuStoreService);

  public destroyRef = inject(DestroyRef);

  public getMenuList(menuList: MenuOption[]): Observable<MenuOption[]> {
    // If it is a static menu, release the comment below
    // Load from types
    menuList = menuList.filter(item => {
      item.selected = false;
      item.open = false;
      return item.menuType === 'C';
    });

    return of(menuList);
  }

  public setNavMenu(menuList: MenuOption[]): Promise<void> {
    return new Promise(resolve => {
      // Get the menu owned by this user through the user id
      this.getMenuList(menuList)
        .pipe(
          finalize(() => {
            resolve();
          }),
          takeUntilDestroyed(this.destroyRef)
        )
        .subscribe(menuList => {
          const temp = fnFlatDataHasParentToTree(menuList);
          // Storage menu
          this.menuStoreService.setMenuArrayStore(temp);
          resolve();
        });
    });
  }
}
