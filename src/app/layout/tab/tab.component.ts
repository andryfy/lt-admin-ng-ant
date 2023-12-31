import { NgIf, NgFor, NgClass, NgStyle, AsyncPipe } from '@angular/common';
import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, inject, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';

import { TabModel, TabService } from '@core/services/common/tab.service';
import { MenuOption } from '@core/services/types';
import { MouseHoverShowDirective } from '@shared/directives/mouse-hover-show.directive';
import { SplitNavStoreService } from '@store/common-store/split-nav-store.service';
import { ThemeService } from '@store/common-store/theme.service';
import { fnStopMouseEvent } from '@utils/tools';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { NzContextMenuService, NzDropdownMenuComponent, NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzTabsModule } from 'ng-zorro-antd/tabs';

@Component({
  selector: 'app-tab',
  templateUrl: './tab.component.html',
  styleUrls: ['./tab.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [NgIf, NzCardModule, NzTabsModule, NgFor, NzDropDownModule, NzMenuModule, NzButtonModule, NgClass, NgStyle, MouseHoverShowDirective, NzIconModule, AsyncPipe]
})
export class TabComponent implements OnInit {
  tabsSourceData: TabModel[] = [];
  tabsSourceData$ = this.tabService.getTabArray$();
  themeOption$ = this.themeService.getThemeMode();
  isNightTheme$ = this.themeService.getIsNightTheme();
  leftMenuArray$: Observable<MenuOption[]> = this.splitNavStoreService.getSplitLeftNavArrayStore();
  isOverMode$ = this.themeService.getIsOverMode();
  isCollapsed$ = this.themeService.getIsCollapsed();
  destroyRef = inject(DestroyRef);

  constructor(
    public tabService: TabService,
    private nzContextMenuService: NzContextMenuService,
    private splitNavStoreService: SplitNavStoreService,
    private themeService: ThemeService,
    public router: Router,
    public cdr: ChangeDetectorRef
  ) {
    this.router.events
      .pipe(filter((event: NzSafeAny) => event instanceof NavigationEnd))
      .pipe(takeUntilDestroyed())
      .subscribe(() => {
        this.cdr.markForCheck();
      });
  }

  get currentIndex(): number {
    return this.tabService.getCurrentTabIndex();
  }

  public trackByTab(index: number, tab: TabModel): string {
    return tab.title;
  }

  // Click the tab to jump to the corresponding path
  goPage(tab: TabModel): void {
    this.router.navigateByUrl(tab.path);
  }

  // Right click to close the right tab
  closeRithTab(tab: TabModel, e: MouseEvent, index: number): void {
    fnStopMouseEvent(e);
    this.tabService.delRightTab(tab.path, index);
  }

  // Right click to close the left tab
  closeLeftTab(tab: TabModel, e: MouseEvent, index: number): void {
    if (index === 0) {
      return;
    }
    fnStopMouseEvent(e);
    this.tabService.delLeftTab(tab.path, index);
  }

  // Close other tabs
  closeOtherTab(tab: TabModel, e: MouseEvent, index: number): void {
    fnStopMouseEvent(e);
    this.tabService.delOtherTab(tab.path, index);
  }

  // Right click to close the current tab
  closeTab(tab: TabModel, e: MouseEvent, index: number): void {
    fnStopMouseEvent(e);
    this.closeCurrentTab(tab, index);
  }

  // Click the close icon on the tab
  clickCloseIcon(indexObj: { index: number }): void {
    this.closeCurrentTab(this.tabsSourceData[indexObj.index], indexObj.index);
  }

  // Close current Tab
  closeCurrentTab(tab: TabModel, index: number): void {
    if (this.tabsSourceData.length === 1) {
      return;
    }
    this.tabService.delTab(tab, index);
    // ngZoneEventCoalescing，ngZoneRunCoalescing For examples, please see main.ts
    this.cdr.detectChanges();
  }

  refresh(): void {
    this.tabService.refresh();
  }

  contextMenu($event: MouseEvent, menu: NzDropdownMenuComponent): void {
    this.nzContextMenuService.create($event, menu);
  }

  closeMenu(): void {
    this.nzContextMenuService.close();
  }

  ngOnInit(): void {
    this.tabsSourceData$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(res => {
      this.tabsSourceData = res;
    });
  }
}
