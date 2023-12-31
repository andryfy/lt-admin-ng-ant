import { DOCUMENT, NgIf, NgTemplateOutlet, NgFor, AsyncPipe } from '@angular/common';
import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, Input, Inject, inject, DestroyRef, booleanAttribute } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, NavigationEnd, Router, RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, map, mergeMap, share, switchMap, tap } from 'rxjs/operators';

import { ThemeMode } from '@app/layout/setting-drawer/setting-drawer.component';
import { TabService } from '@core/services/common/tab.service';
import { MenuOption } from '@core/services/types';
import { AuthDirective } from '@shared/directives/auth.directive';
import { TrackByPropertyDirective } from '@shared/directives/track-by-property.directive';
import { MenuStoreService } from '@store/common-store/menu-store.service';
import { SplitNavStoreService } from '@store/common-store/split-nav-store.service';
import { ThemeService } from '@store/common-store/theme.service';
import { UserInfoService } from '@store/common-store/userInfo.service';
import { fnStopMouseEvent } from '@utils/tools';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzNoAnimationModule } from 'ng-zorro-antd/core/no-animation';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzMenuModule } from 'ng-zorro-antd/menu';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [NgIf, NzMenuModule, NzNoAnimationModule, NgTemplateOutlet, NgFor, TrackByPropertyDirective, AuthDirective, NzButtonModule, NzIconModule, RouterLink, AsyncPipe]
})
export class NavBarComponent implements OnInit {
  @Input({ transform: booleanAttribute })
  isMixiHead = false; // is a mixed mode top navigation
  @Input({ transform: booleanAttribute })
  isMixiLeft = false;

  themeOption$ = this.themeService.getThemeMode();
  isNightTheme$ = this.themeService.getIsNightTheme();
  isCollapsed$ = this.themeService.getIsCollapsed();
  isOverMode$ = this.themeService.getIsOverMode();
  leftMenuArray$ = this.splitNavStoreService.getSplitLeftNavArrayStore();

  routerPath = this.router.url;
  themeMode: ThemeMode['key'] = 'side';
  isOverMode = false;
  isCollapsed = false;
  isMixiMode = false;
  leftMenuArray: MenuOption[] = [];
  menus: MenuOption[] = [];
  copyMenus: MenuOption[] = [];
  authCodeArray: string[] = [];
  subTheme$: Observable<any>;
  destroyRef = inject(DestroyRef);

  constructor(
    private router: Router,
    private userInfoService: UserInfoService,
    private menuServices: MenuStoreService,
    private splitNavStoreService: SplitNavStoreService,
    private activatedRoute: ActivatedRoute,
    private tabService: TabService,
    private cdr: ChangeDetectorRef,
    private themeService: ThemeService,
    private titleServe: Title,
    @Inject(DOCUMENT) private doc: Document
  ) {
    this.initMenus();

    this.subTheme$ = this.isOverMode$.pipe(
      switchMap(res => {
        this.isOverMode = res;
        return this.themeOption$;
      }),
      tap(options => {
        this.themeMode = options.mode;
        this.isMixiMode = this.themeMode === 'mixi';
      }),
      share(),
      takeUntilDestroyed(this.destroyRef)
    );

    // Listen to the left menu data source in mixed mode
    this.subMixiModeSideMenu();
    // Listen to collapse menu events
    this.subIsCollapsed();
    this.subAuth();
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        tap(() => {
          this.subTheme$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
            // When the theme is switched to mixed mode, set the left menu data source
            // If placed in ngInit monitoring, it will switch routes after refreshing the page in mixed mode, runOutSideAngular
            if (this.isMixiMode) {
              this.setMixModeLeftMenu();
            }
          });
          // @ts-ignore
          this.routerPath = this.activatedRoute.snapshot['_routerState'].url;
          // Make a copyMenus to record the current menu status,
          // because the sub-menu is not displayed in the top mode, but the theme is switched from the top mode to the sidebar mode, and the status of the menu in the current top mode must be reflected in the menu in the sidebar mode.
          this.clickMenuItem(this.menus);
          this.clickMenuItem(this.copyMenus);
          // It is a folded menu and not an over menu. It solves the bug of floating box menu when switching tabs when folding the left menu.
          if (this.isCollapsed && !this.isOverMode) {
            this.closeMenuOpen(this.menus);
          }

          // Top menu mode, and not over mode, solves the bug of floating box menu when switching tabs in top mode
          if (this.themeMode === 'top' && !this.isOverMode) {
            this.closeMenu();
          }
        }),
        map(() => this.activatedRoute),
        map(route => {
          while (route.firstChild) {
            route = route.firstChild;
          }
          return route;
        }),
        filter(route => {
          return route.outlet === 'primary';
        }),
        mergeMap(route => {
          return route.data;
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(routeData => {
        // Whether the details page opens a new tab page
        let isNewTabDetailPage = routeData['newTab'] === 'true';

        let route = this.activatedRoute;
        while (route.firstChild) {
          route = route.firstChild;
        }

        this.tabService.addTab(
          {
            snapshotArray: [route.snapshot],
            title: routeData['title'],
            path: this.routerPath
          },
          isNewTabDetailPage
        );
        this.tabService.findIndex(this.routerPath);
        // After angular16, you can set the title directly in the route.
        this.titleServe.setTitle(`${routeData['title']} - LT Admin`);
        // In mixed mode, switch tabs so that the left menu changes accordingly.
        this.setMixModeLeftMenu();
      });
  }

  initMenus(): void {
    this.menuServices
      .getMenuArrayStore()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(menusArray => {
        this.menus = menusArray;
        this.copyMenus = this.cloneMenuArray(this.menus);
        this.clickMenuItem(this.menus);
        this.clickMenuItem(this.copyMenus);
        this.cdr.markForCheck();
      });
  }

  // Data source for left menu "auto-split menu" mode when setting blending mode
  setMixModeLeftMenu(): void {
    this.menus.forEach(item => {
      if (item.selected) {
        this.splitNavStoreService.setSplitLeftNavArrayStore(item.children || []);
      }
    });
  }

  // deep copy clone menu array
  cloneMenuArray(sourceMenuArray: MenuOption[], target: MenuOption[] = []): MenuOption[] {
    sourceMenuArray.forEach(item => {
      const menuOption: MenuOption = { menuName: '', menuType: 'C', path: '', id: -1, fatherId: -1 };
      for (let i in item) {
        if (item.hasOwnProperty(i)) {
          // @ts-ignore
          if (Array.isArray(item[i])) {
            // @ts-ignore
            menuOption[i] = this.cloneMenuArray(item[i]);
          } else {
            // @ts-ignore
            menuOption[i] = item[i];
          }
        }
      }
      target.push({ ...menuOption });
    });
    return target;
  }

  // Blend Mode Click on the first-level menu to make the first submenu under the first-level menu selected
  changTopNav(index: number): void {
    // The currently selected first-level menu object
    const currentTopNav = this.menus[index];
    let currentLeftNavArray = currentTopNav.children || [];
    // If there is a second-level menu under the first-level menu
    if (currentLeftNavArray.length > 0) {
      // Current left navigation array
      /*Added permission version*/
      // Get the authorized secondary menu collection (shown on the left)
      currentLeftNavArray = currentLeftNavArray.filter(item => {
        return this.authCodeArray.includes(item.code!);
      });
      // If the first second level menu, no third level menu
      if (currentLeftNavArray.length > 0 && !currentLeftNavArray[0].children) {
        this.router.navigateByUrl(currentLeftNavArray[0].path!);
      } else if (currentLeftNavArray.length > 0 && currentLeftNavArray[0].children) {
        // If there is a third-level menu, jump to the first third-level menu
        this.router.navigateByUrl(currentLeftNavArray[0].children[0].path!);
      }
      /*Added permission version end*/
      /*Note that there is no permission version*/
      // const currentLeftNavArray = currentTopNav.children;
      // if (!currentLeftNavArray[0].children) {
      //   this.router.navigateByUrl(currentLeftNavArray[0].path!);
      //   this.splitNavStoreService.setSplitLeftNavArrayStore(currentLeftNavArray);
      // } else {
      //   this.router.navigateByUrl(currentLeftNavArray[0].children[0].path!);
      //   this.splitNavStoreService.setSplitLeftNavArrayStore(currentLeftNavArray);
      // }
    }
    this.splitNavStoreService.setSplitLeftNavArrayStore(currentLeftNavArray);
  }

  flatMenu(menus: MenuOption[], routePath: string): void {
    menus.forEach(item => {
      item.selected = false;
      item.open = false;
      if (routePath.includes(item.path) && !item.newLinkFlag) {
        item.selected = true;
        item.open = true;
      }
      if (!!item.children && item.children.length > 0) {
        this.flatMenu(item.children, routePath);
      }
    });
  }

  clickMenuItem(menus: MenuOption[]): void {
    if (!menus) {
      return;
    }
    const index = this.routerPath.indexOf('?') === -1 ? this.routerPath.length : this.routerPath.indexOf('?');
    const routePath = this.routerPath.substring(0, index);
    this.flatMenu(menus, routePath);
    this.cdr.markForCheck();
  }

  // Change the current menu display state
  changeOpen(currentMenu: MenuOption, allMenu: MenuOption[]): void {
    allMenu.forEach(item => {
      item.open = false;
    });
    currentMenu.open = true;
  }

  closeMenuOpen(menus: MenuOption[]): void {
    menus.forEach(menu => {
      menu.open = false;
      if (menu.children && menu.children.length > 0) {
        this.closeMenuOpen(menu.children);
      } else {
        return;
      }
    });
  }

  changeRoute(e: MouseEvent, menu: MenuOption): void {
    if (menu.newLinkFlag) {
      fnStopMouseEvent(e);
      window.open(menu.path, '_blank');
      return;
    }
    this.router.navigate([menu.path]);
  }

  // Listen to collapse menu events
  subIsCollapsed(): void {
    this.isCollapsed$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(isCollapsed => {
      this.isCollapsed = isCollapsed;
      // menu expand
      if (!this.isCollapsed) {
        this.menus = this.cloneMenuArray(this.copyMenus);
        this.clickMenuItem(this.menus);
        // In the mixed mode, click on the data source of the left menu, otherwise the menu with the secondary menu will not open when the collapsed state changes to expanded
        if (this.themeMode === 'mixi') {
          this.clickMenuItem(this.leftMenuArray);
        }
      } else {
        // Menu close
        this.copyMenus = this.cloneMenuArray(this.menus);
        this.closeMenuOpen(this.menus);
      }
      this.cdr.markForCheck();
    });
  }

  closeMenu(): void {
    this.clickMenuItem(this.menus);
    this.clickMenuItem(this.copyMenus);
    this.closeMenuOpen(this.menus);
  }

  subAuth(): void {
    this.userInfoService
      .getUserInfo()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(res => (this.authCodeArray = res.authCode));
  }

  // Listen to the left menu data source in mixed mode
  private subMixiModeSideMenu(): void {
    this.leftMenuArray$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(res => {
      this.leftMenuArray = res;
    });
  }

  ngOnInit(): void {
    // Close the open state of the menu in top mode
    this.subTheme$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(options => {
      if (options.mode === 'top' && !this.isOverMode) {
        this.closeMenu();
      }
    });
  }
}
