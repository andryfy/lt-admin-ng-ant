import { NgIf, NgClass, NgStyle, AsyncPipe } from '@angular/common';
import { Component, OnInit, ChangeDetectionStrategy, inject, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Observable } from 'rxjs';

import { InitTheme } from '@app/config/constant';
import { ThemeOption } from '@app/core/services/types';
import { ChatComponent } from '@shared/components/chat/chat.component';
import { TopProgressBarComponent } from '@shared/components/top-progress-bar/top-progress-bar.component';
import { SplitNavStoreService } from '@store/common-store/split-nav-store.service';
import { ThemeService } from '@store/common-store/theme.service';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzNoAnimationModule } from 'ng-zorro-antd/core/no-animation';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';

import { SettingDrawerComponent } from '../setting-drawer/setting-drawer.component';

@Component({
  selector: 'app-def-layout-content',
  templateUrl: './def-layout-content.component.html',
  styleUrls: ['./def-layout-content.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [TopProgressBarComponent, NzLayoutModule, NgIf, NgClass, NzNoAnimationModule, NgStyle, SettingDrawerComponent, ChatComponent, NzMenuModule, NzButtonModule, NzIconModule, AsyncPipe]
})
export class DefLayoutContentComponent implements OnInit {
  showChats = true;
  isNightTheme$ = this.themeService.getIsNightTheme();
  themeOption$ = this.themeService.getThemeMode();
  isMixiMode = false;
  themeOption: ThemeOption = InitTheme;
  isFixedLeftNav = false;
  isOverMode$: Observable<boolean> = this.themeService.getIsOverMode();
  isCollapsed$: Observable<boolean> = this.themeService.getIsCollapsed();
  // In mixed mode, determine whether the top menu has a submenu. If there is no submenu, hide the left menu.
  mixiModeLeftNav = this.splitNavStoreService.getSplitLeftNavArrayStore();
  contentMarginTop = '48px';
  destroyRef = inject(DestroyRef);
  constructor(private themeService: ThemeService, private splitNavStoreService: SplitNavStoreService) {}

  changeCollapsed(isCollapsed: boolean): void {
    this.themeService.setIsCollapsed(isCollapsed);
  }

  getThemeOption(): void {
    this.themeOption$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(res => {
      this.themeOption = res;
      this.isMixiMode = res.mode === 'mixi';
      this.isFixedLeftNav = this.themeOption.fixedLeftNav;

      if (this.themeOption.fixedHead && !this.isMixiMode && this.themeOption.hasTopArea) {
        this.contentMarginTop = this.themeOption.isShowTab ? (this.themeOption.fixedTab ? '96px' : '48px') : '48px';
      } else {
        this.contentMarginTop = this.themeOption.isShowTab ? (this.themeOption.fixedTab ? '48px' : '0px') : '0px';
      }
    });
  }

  ngOnInit(): void {
    this.getThemeOption();
  }
}
