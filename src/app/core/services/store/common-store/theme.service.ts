import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

import { InitTheme, ThemeOptionKey } from '@app/config/constant';
import { WindowService } from '@core/services/common/window.service';

import { ThemeOption } from '../../types';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private windowServicevice: WindowService = inject(WindowService);

  private isNightTheme$ = new BehaviorSubject<boolean>(false);
  private isOverModeTheme$ = new BehaviorSubject<boolean>(false);
  private themeMode$ = new BehaviorSubject<ThemeOption>(InitTheme);

  private isCollapsed$ = new BehaviorSubject<boolean>(false);

  constructor() {}

  // Get theme options
  getThemeOptionStorage(): ThemeOption {
    const themeOption = this.windowServicevice.getStorage(ThemeOptionKey) || '';
    return JSON.parse(themeOption);
  }

  // Get theme parameters
  setThemeMode(mode: ThemeOption): void {
    this.themeMode$.next(mode);
  }

  getThemeMode(): Observable<ThemeOption> {
    return this.themeMode$.asObservable();
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

  // TODO: Theme Custom for each module
  public get themeOptionStorage(): ThemeOption {
    const themeOption: ThemeOption = JSON.parse(this.windowServicevice.getStorage(ThemeOptionKey) as string);
    console.warn('ThemeOption: ', themeOption);
    return themeOption;
  }

  public setThemeOptionStorage(themeOption: ThemeOption): void {
    console.warn('NewTheme: ', themeOption);

    this.removeThemeOptionStorage();
    this.windowServicevice.setStorage(ThemeOptionKey, JSON.stringify(themeOption));
  }

  public removeThemeOptionStorage(): void {
    this.windowServicevice.removeStorage(ThemeOptionKey);
  }
}
