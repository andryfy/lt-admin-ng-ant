import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

import { Menu } from '../../types';

/**
 * When the menu is automatically split, the store of the left menu
 */
@Injectable({
  providedIn: 'root'
})
export class SplitNavStoreService {
  private splitLeftNavArray$ = new BehaviorSubject<Menu[]>([]);

  constructor() {}

  setSplitLeftNavArrayStore(menu: Menu[]): void {
    this.splitLeftNavArray$.next(menu);
  }

  getSplitLeftNavArrayStore(): Observable<Menu[]> {
    return this.splitLeftNavArray$.asObservable();
  }
}
