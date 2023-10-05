/*
 * Only when the menu is statically loaded, the following comments can be turned on
 * And you need to release the annotations in the src/app/core/services/http/login/login.service.ts file
 * */

import { InjectionToken } from '@angular/core';

import { defaultMenu } from '@app/modules/default/config/menu';
import { ActionCode } from '@config/actionCode';
import { MenuOption } from '@core/services/types';

// /!*Define menu*!/
export const MENU_TOKEN = new InjectionToken<MenuOption[]>('menu-token', {
  providedIn: 'root',
  factory(): MenuOption[] {
    return menuNav;
  }
});

const menuNav: MenuOption[] = [...defaultMenu];
