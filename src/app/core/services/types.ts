/*
 * Common interface
 * */

import { Type } from '@angular/core';

import { Theme, ThemeMode } from '@app/layout/setting-drawer/setting-drawer.component';
import { NzSafeAny } from 'ng-zorro-antd/core/types';

// dynamic components
export class DynamicComponent {
  constructor(public component: Type<NzSafeAny>, public data: NzSafeAny) {}
}

// select drop down
export interface OptionInterface {
  value: number | string;
  label: string;
}

// List search
export interface SearchCommonVO<T> {
  pageNum: number;
  pageSize: number;
  filters?: T;
}

// paging
export interface PageInfo<T> {
  pageNum: number;
  pageSize: number;
  size?: number;
  orderBy?: string;
  startRow?: number;
  endRow?: number;
  total: number;
  pages?: number;
  list: T[];
  firstPage?: number;
  prePage?: number;
  nextPage?: number;
  lastPage?: number;
  isFirstPage?: boolean;
  isLastPage?: boolean;
  hasPreviousPage?: boolean;
  hasNextPage?: boolean;
  navigatePages?: number;
  navigatepageNums?: number[];
}

// dynamic components
export interface AdComponent {
  data: NzSafeAny;
}

// Cascade selection data structure
export interface CascaderOption {
  value: number | string;
  label: string;
  children?: CascaderOption[];
  isLeaf?: boolean;
}

/*
 * Menu
 * */
export interface MenuOption {
  id: number | string;
  fatherId: number | string;
  path: string;
  menuName: string;
  menuType: 'C' | 'F'; // C: Menu, F: Button
  icon?: string; // If showIcon is false, when setting this to the search window, the leftmost icon
  alIcon?: string; // If showIcon is false, when setting this to the search window, the leftmost icon
  open?: boolean;
  selected?: boolean; // Is it selected
  children?: MenuOption[];
  code?: string; // Permission code
  newLinkFlag?: 0 | 1; // Is it a new page?
}

/**
 * Theme
 */
export interface ThemeOption {
  theme: Theme['key']; // Theme mode (dark mode, light mode)
  color: string; // theme color
  mode: ThemeMode['key']; // Menu modes (side mode, top mode, mixed mode)
  colorWeak: boolean; // color blindness
  greyTheme: boolean; // gray mode
  fixedHead: boolean; // fixed head
  splitNav: boolean; // Whether to split the menu (only takes effect when the menu mode is mixed mode)
  fixedLeftNav: boolean; // fixed left menu
  isShowTab: boolean; // Whether to display multiple tabs
  fixedTab: boolean; // Fixed tab page
  hasTopArea: boolean; // Whether to display the top area
  hasFooterArea: boolean; // Whether to display the bottom area
  hasNavArea: boolean; // Is there a menu
  hasNavHeadArea: boolean; // Does the menu have a menu header?
}

/**
 * Module config
 */
export interface ModuleOption {
  code: string;
  name: string;
  theme: ThemeOption;
  menuList: MenuOption[];
}
