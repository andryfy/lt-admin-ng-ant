import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

import { Theme, ThemeMode } from '@app/layout/setting-drawer/setting-drawer.component';

export interface SettingInterface {
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

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private isNightTheme$ = new BehaviorSubject<boolean>(false);
  private isOverModeTheme$ = new BehaviorSubject<boolean>(false);
  private themesMode$ = new BehaviorSubject<SettingInterface>({
    theme: 'dark',
    color: '#1890FF',
    mode: 'side',
    isShowTab: true,
    colorWeak: false,
    greyTheme: false,
    splitNav: false,
    fixedTab: true,
    fixedHead: true,
    fixedLeftNav: true,
    hasTopArea: true,
    hasFooterArea: true,
    hasNavArea: true,
    hasNavHeadArea: true
  });

  private isCollapsed$ = new BehaviorSubject<boolean>(false);

  constructor() {}

  // Get theme parameters
  setThemesMode(mode: SettingInterface): void {
    this.themesMode$.next(mode);
  }

  getThemesMode(): Observable<SettingInterface> {
    return this.themesMode$.asObservable();
  }

  // Whether the theme is a dark theme
  setIsNightTheme(isNight: boolean): void {
    this.isNightTheme$.next(isNight);
  }

  getIsNightTheme(): Observable<boolean> {
    return this.isNightTheme$.asObservable();
  }

  // Whether the theme overrides the sidebar
  setIsOverMode(isNight: boolean): void {
    this.isOverModeTheme$.next(isNight);
  }

  getIsOverMode(): Observable<boolean> {
    return this.isOverModeTheme$.asObservable();
  }

  // Whether the menu is collapsed
  setIsCollapsed(isCollapsed: boolean): void {
    this.isCollapsed$.next(isCollapsed);
  }

  getIsCollapsed(): Observable<boolean> {
    return this.isCollapsed$.asObservable();
  }
}
