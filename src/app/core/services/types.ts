/*
 * Common interface
 * */

import { Type } from '@angular/core';

import { NzSafeAny } from 'ng-zorro-antd/core/types';

// dynamic components
export class DynamicComponent {
  constructor(public component: Type<NzSafeAny>, public data: NzSafeAny) {}
}

// select drop down
export interface OptionsInterface {
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
 * menu
 * */
export interface Menu {
  id: number | string;
  fatherId: number | string;
  path: string;
  menuName: string;
  menuType: 'C' | 'F'; // c:menu, f button
  icon?: string; // If showIcon is false, when setting this to the search window, the leftmost icon
  alIcon?: string; // If showIcon is false, when setting this to the search window, the leftmost icon
  open?: boolean;
  selected?: boolean; // Is it selected
  children?: Menu[];
  code?: string; // Permission code
  newLinkFlag?: 0 | 1; // Is it a new page?
}
