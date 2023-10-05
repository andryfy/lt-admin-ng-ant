import { BreakpointObserver } from '@angular/cdk/layout';
import { DestroyRef, inject, Injectable } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { switchMap } from 'rxjs/operators';

import { SideCollapsedMaxWidth, TopCollapsedMaxWidth } from '@config/constant';
import { ThemeService } from '@store/common-store/theme.service';
import { EquipmentWidth, WindowsWidthService } from '@store/common-store/windows-width.service';

/*Monitor screen width service*/
@Injectable({
  providedIn: 'root'
})
export class SubWindowWithService {
  subWidthObj: { [key: string]: [EquipmentWidth, [number, number]] } = {
    '(max-width: 575.98px)': [EquipmentWidth.xs, [0, 575.98]],
    '(min-width: 576px) and (max-width: 767.98px)': [EquipmentWidth.sm, [576, 767.98]],
    '(min-width: 768px) and (max-width: 991.98px)': [EquipmentWidth.md, [768, 991.98]],
    '(min-width: 992px) and (max-width: 1199.98px)': [EquipmentWidth.lg, [992, 1199.98]],
    '(min-width: 1200px) and (max-width: 1599.98px)': [EquipmentWidth.xl, [1200, 1599.98]],
    '(min-width: 1600px)': [EquipmentWidth.xxl, [1600, 9999]]
  };
  destroyRef = inject(DestroyRef);

  constructor(private winWidthService: WindowsWidthService, private breakpointObserver: BreakpointObserver, private themeService: ThemeService) {}

  // Monitor the topic (top or side) and determine the minimum width of over mode
  subWidthForTheme(): void {
    this.themeService
      .getThemeMode()
      .pipe(
        switchMap(res => {
          let maxWidth = '';
          if (res.mode === 'side' || (res.mode === 'mixi' && !res.splitNav)) {
            maxWidth = `(max-width: ${SideCollapsedMaxWidth}px)`;
          } else if (res.mode === 'top' || (res.mode === 'mixi' && res.splitNav)) {
            maxWidth = `(max-width: ${TopCollapsedMaxWidth}px)`;
          }
          // Can be used as a ginseng[Breakpoints.Small, Breakpoints.XSmall]
          return this.breakpointObserver.observe([maxWidth]);
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(result => {
        const isOverMode = result.matches;
        this.themeService.setIsOverMode(isOverMode);
        // It is over mode, expand the left menu in the folded state
        if (isOverMode) {
          this.themeService.setIsCollapsed(false);
        }
      });
  }

  // Determine which grid node it is based on the incoming screen width
  judgeWindowsWidth(width: number): EquipmentWidth {
    let currentPoint: EquipmentWidth;
    Object.values(this.subWidthObj).forEach(item => {
      if (width >= item[1][0] && width <= item[1][1]) {
        currentPoint = item[0];
      }
    });
    return currentPoint!;
  }

  // Listening to browser width for use with common grid systems
  subWidthForStore(): void {
    this.breakpointObserver
      .observe(Object.keys(this.subWidthObj))
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(res => {
        Object.keys(res.breakpoints).forEach(item => {
          if (res.breakpoints[item]) {
            this.winWidthService.setWindowWidthStore(this.subWidthObj[item][0]);
          }
        });
      });
  }

  subWindowWidth(): void {
    this.subWidthForTheme();
    this.subWidthForStore();
    // Set the current node during initialization
    this.winWidthService.setWindowWidthStore(this.judgeWindowsWidth(window.innerWidth));
  }
}
