import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

import { MenuOption } from '@core/services/types';

// menu store service
@Injectable({
  providedIn: 'root'
})
export class MenuStoreService {
  private menuArray$ = new BehaviorSubject<MenuOption[]>([]);

  constructor() {}

  setMenuArrayStore(menuArray: MenuOption[]): void {
    this.menuArray$.next(menuArray);
  }

  getMenuArrayStore(): Observable<MenuOption[]> {
    return this.menuArray$.asObservable();
  }
}
