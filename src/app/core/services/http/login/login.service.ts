import { Inject, Injectable } from '@angular/core';
import { delay, Observable, of } from 'rxjs';

// import { MENU_TOKEN } from '@config/menu';
import { MENU_TOKEN } from '@app/config/menu';
import { Menu } from '@core/services/types';
import { BaseHttpService } from '@services/base-http.service';
import { MenusService } from '@services/system/menus.service';

export interface UserLogin {
  name: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  constructor(public http: BaseHttpService, @Inject(MENU_TOKEN) public menus: Menu[], private menuService: MenusService) {}

  public login(params: UserLogin): Observable<string> {
    return this.http.post('/login', params, { needSuccessInfo: false });
  }

  public getMenuByUserId(userId: number): Observable<Menu[]> {
    // If it is a static menu, release the comment below
    return of(this.menus); // Load from types
    return this.http.get(`/sysPermission/menu/${userId}`); // Load from server : http://1.117.181.242:8003/ (see proxy.conf.json)
  }
}
