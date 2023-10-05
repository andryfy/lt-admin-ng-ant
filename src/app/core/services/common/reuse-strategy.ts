import { DOCUMENT } from '@angular/common';
import { DestroyRef, inject, Inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRouteSnapshot, DetachedRouteHandle, RouteReuseStrategy } from '@angular/router';

import { ScrollService } from '@core/services/common/scroll.service';
import { ThemeService } from '@store/common-store/theme.service';
import { fnGetReuseStrategyKeyFn, getDeepReuseStrategyKeyFn } from '@utils/tools';
import { NzSafeAny } from 'ng-zorro-antd/core/types';

export type ReuseHookTypes = '_onReuseInit' | '_onReuseDestroy';

export interface ReuseComponentInstance {
  _onReuseInit: () => void;
  _onReuseDestroy: () => void;
}

export interface ReuseComponentRef {
  instance: ReuseComponentInstance;
}

/*route multiplexing*/
// reference https://zhuanlan.zhihu.com/p/29823560
// https://blog.csdn.net/weixin_30561425/article/details/96985967?utm_medium=distribute.pc_relevant.none-task-blog-BlogCommendFromMachineLearnPai2-1.control&depth_1-utm_source=distribute.pc_relevant.none-task-blog-BlogCommendFromMachineLearnPai2-1.control
export class SimpleReuseStrategy implements RouteReuseStrategy {
  destroyRef = inject(DestroyRef);
  // Cache the map of each component
  static handlers: { [key: string]: NzSafeAny } = {};
  // Cache the scroll position of each page, why not put it in the handlers, because when the route leaves, the route reuse causes the current page as the key to be null
  static scrollHandlers: { [key: string]: NzSafeAny } = {};

  // The purpose of this parameter is to click the delete button in the current tab. Although the tab is closed, when the route leaves, the components of the closed tab will still be cached.
  // Use this parameter to record whether the current route needs to be cached
  public static waitDelete: string | null;

  // Whether there are multiple tabs. If there are no multiple tabs, route caching will not be done.
  isShowTab$ = inject(ThemeService).getThemeMode();

  public static deleteRouteSnapshot(key: string): void {
    if (SimpleReuseStrategy.handlers[key]) {
      if (SimpleReuseStrategy.handlers[key].componentRef) {
        SimpleReuseStrategy.handlers[key].componentRef.destroy();
      }
      delete SimpleReuseStrategy.handlers[key];
      delete SimpleReuseStrategy.scrollHandlers[key];
    }
  }

  // Delete all caches, which is needed for operations such as logging out and not using multiple tags.
  public static deleteAllRouteSnapshot(route: ActivatedRouteSnapshot): Promise<void> {
    return new Promise(resolve => {
      Object.keys(SimpleReuseStrategy.handlers).forEach(key => {
        SimpleReuseStrategy.deleteRouteSnapshot(key);
      });
      SimpleReuseStrategy.waitDelete = getDeepReuseStrategyKeyFn(route);
      resolve();
    });
  }

  constructor(@Inject(DOCUMENT) private doc: Document, private scrollService: ScrollService) {}

  // Whether to allow route reuse
  shouldDetach(route: ActivatedRouteSnapshot): boolean {
    // Whether to display multiple tabs, if not, route reuse will not be performed
    let isShowTab = false;
    this.isShowTab$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(res => {
      isShowTab = res.isShowTab;
    });
    return route.data['shouldDetach'] !== 'no' && isShowTab;
  }

  // Triggered when the route leaves, the route is stored
  store(route: ActivatedRouteSnapshot, handle: NzSafeAny): void {
    if (route.data['shouldDetach'] === 'no') {
      return;
    }
    const key = fnGetReuseStrategyKeyFn(route);
    // If the route to be deleted is the current route, the snapshot will not be stored.
    if (SimpleReuseStrategy.waitDelete === key) {
      this.runHook('_onReuseDestroy', handle.componentRef);
      handle.componentRef.destroy();
      SimpleReuseStrategy.waitDelete = null;
      delete SimpleReuseStrategy.scrollHandlers[key];
      return;
    }

    // Cache the scroll position of the current page when leaving the route
    // By default, keepScroll is required. If keepScroll is not required, add needKeepScroll.:no attribute
    const innerScrollContainer = [];
    if (route.data['needKeepScroll'] !== 'no') {
      const scrollContain = route.data['scrollContain'] ?? [];
      scrollContain.forEach((item: string) => {
        const el = this.doc.querySelector(item)!;
        if (el) {
          const position = this.scrollService.getScrollPosition(el);
          innerScrollContainer.push({ [item]: position });
        }
      });
      innerScrollContainer.push({ window: this.scrollService.getScrollPosition() });
    }

    SimpleReuseStrategy.scrollHandlers[key] = { scroll: innerScrollContainer };
    SimpleReuseStrategy.handlers[key] = handle;

    if (handle && handle.componentRef) {
      this.runHook('_onReuseDestroy', handle.componentRef);
    }
  }

  // Whether to allow route restoration
  shouldAttach(route: ActivatedRouteSnapshot): boolean {
    const key = fnGetReuseStrategyKeyFn(route);
    return !!key && !!SimpleReuseStrategy.handlers[key];
  }

  // Get storage route
  retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle {
    const key = fnGetReuseStrategyKeyFn(route);
    return !key ? null : SimpleReuseStrategy.handlers[key];
  }

  // Triggered by entering the route and reusing the route when the same route is used
  shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
    const futureKey = fnGetReuseStrategyKeyFn(future);
    const currKey = fnGetReuseStrategyKeyFn(curr);
    if (!!futureKey && SimpleReuseStrategy.handlers[futureKey]) {
      this.runHook('_onReuseInit', SimpleReuseStrategy.handlers[futureKey].componentRef);
    }

    const result = futureKey === currKey;
    // Lazy loading cannot read data. Use this method to drill down to the lowest level route.
    while (future.firstChild) {
      future = future.firstChild;
    }
    // Re-acquisition is because the future has changed in the above while loop
    const scrollFutureKey = fnGetReuseStrategyKeyFn(future);
    if (!!scrollFutureKey && SimpleReuseStrategy.scrollHandlers[scrollFutureKey]) {
      SimpleReuseStrategy.scrollHandlers[scrollFutureKey].scroll.forEach((elOptionItem: { [key: string]: [number, number] }) => {
        Object.keys(elOptionItem).forEach(element => {
          setTimeout(() => {
            this.scrollService.scrollToPosition(this.doc.querySelector(element), elOptionItem[element]);
          }, 1);
        });
      });
    }
    return result;
  }

  runHook(method: ReuseHookTypes, comp: ReuseComponentRef): void {
    const compThis = comp.instance;
    if (comp == null || !compThis) {
      return;
    }
    const fn = compThis[method];
    if (typeof fn !== 'function') {
      return;
    }
    (fn as () => void).call(compThis);
  }
}
