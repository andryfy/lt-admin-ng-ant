import { AsyncPipe, CommonModule, NgIf, NgTemplateOutlet } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, Component, DestroyRef, OnInit, ViewChild, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterOutlet } from '@angular/router';

import { fadeRouteAnimation } from '@app/animations/fade.animation';
import { IsFirstLogin } from '@app/config/constant';
import { DriverService } from '@app/core/services/common/driver.service';
import { WindowService } from '@app/core/services/common/window.service';
import { ThemeService } from '@app/core/services/store/common-store/theme.service';
import { LayoutHeadRightMenuComponent } from '@app/shared/biz-components/layout-components/layout-head-right-menu/layout-head-right-menu.component';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';

import { DefLayoutContentComponent } from './def-layout-content/def-layout-content.component';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { NavDrawerComponent } from './nav-drawer/nav-drawer.component';
import { SideNavComponent } from './side-nav/side-nav.component';
import { TabComponent } from './tab/tab.component';
import { ToolBarComponent } from './tool-bar/tool-bar.component';

@Component({
  selector: 'app-base',
  templateUrl: './base.component.html',
  styleUrls: ['./base.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [fadeRouteAnimation],
  standalone: true,
  imports: [
    CommonModule,
    DefLayoutContentComponent,
    NgIf,
    SideNavComponent,
    NgTemplateOutlet,
    ToolBarComponent,
    NzIconModule,
    NzButtonModule,
    NavBarComponent,
    LayoutHeadRightMenuComponent,
    TabComponent,
    RouterOutlet,
    NavDrawerComponent,
    AsyncPipe
  ]
})
export class BaseComponent implements OnInit, AfterViewInit {
  isCollapsed$ = this.themeService.getIsCollapsed();
  themeOptions$ = this.themeService.getThemeMode();
  isCollapsed = false;
  isOverMode = false; // When the window becomes narrower, whether the navigation bar becomes drawer mode
  @ViewChild('navDrawer') navDrawer!: NavDrawerComponent;
  destroyRef = inject(DestroyRef);
  constructor(private themeService: ThemeService, private driverService: DriverService, private windowService: WindowService) {}

  changeCollapsed(): void {
    if (this.isOverMode) {
      this.navDrawer.showDraw();
      return;
    }
    this.isCollapsed = !this.isCollapsed;
    this.themeService.setIsCollapsed(this.isCollapsed);
  }

  // Monitor various streams
  subTheme(): void {
    this.themeService
      .getIsCollapsed()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(res => (this.isCollapsed = res));
    this.themeService
      .getIsOverMode()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(res => (this.isOverMode = res));
  }

  prepareRoute(outlet: RouterOutlet): string {
    return outlet?.activatedRouteData?.['key'];
  }

  ngAfterViewInit(): void {
    if (this.windowService.getStorage(IsFirstLogin) === 'false') {
      return;
    }
    this.windowService.setStorage(IsFirstLogin, 'false');
    this.driverService.load();
  }

  ngOnInit(): void {
    this.subTheme();
  }
}
