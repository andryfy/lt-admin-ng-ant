import { Inject, Injectable } from '@angular/core';
import { delay, Observable, of } from 'rxjs';

// import { MENU_TOKEN } from '@config/menu';
import { MENU_TOKEN } from '@app/config/menu';
import { MenuOption } from '@core/services/types';
import { BaseHttpService } from '@http/base-http.service';

export interface UserLogin {
  name: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  constructor(public http: BaseHttpService, @Inject(MENU_TOKEN) public menuList: MenuOption[]) {}

  public login(params: UserLogin): Observable<string> {
    return this.http.post('/login', params, { needSuccessInfo: false });
  }

  public getMenuByUserId(userId: number): Observable<MenuOption[]> {
    // If it is a static menu, release the comment below
    return of(this.menuList); // Load from types
  }
}
