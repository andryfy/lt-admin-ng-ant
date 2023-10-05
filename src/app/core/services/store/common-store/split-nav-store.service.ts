import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

import { MenuOption } from '../../types';

/**
 * When the menu is automatically split, the store of the left menu
 */
@Injectable({
  providedIn: 'root'
})
export class SplitNavStoreService {
  private splitLeftNavArray$ = new BehaviorSubject<MenuOption[]>([]);

  constructor() {}

  setSplitLeftNavArrayStore(menu: MenuOption[]): void {
    this.splitLeftNavArray$.next(menu);
  }

  getSplitLeftNavArrayStore(): Observable<MenuOption[]> {
    return this.splitLeftNavArray$.asObservable();
  }
}
