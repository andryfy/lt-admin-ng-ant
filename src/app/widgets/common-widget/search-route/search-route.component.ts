import { normalizePassiveListenerOptions } from '@angular/cdk/platform';
import { NgIf, NgFor } from '@angular/common';
import { Component, OnInit, ChangeDetectionStrategy, ViewChild, ElementRef, AfterViewInit, ChangeDetectorRef, HostListener, NgZone, inject, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { fromEvent, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, switchMap } from 'rxjs/operators';

import { MenuOption } from '@core/services/types';
import { MenuStoreService } from '@store/common-store/menu-store.service';
import { ThemeService } from '@store/common-store/theme.service';
import { BasicConfirmModalComponent } from '@widgets/base-modal';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzModalRef } from 'ng-zorro-antd/modal';

interface ResultItem {
  selItem: boolean;
  isAliIcon: boolean;
  title: string;
  routePath: string;
  icon: string;
}

const passiveEventListenerOptions = <AddEventListenerOptions>normalizePassiveListenerOptions({ passive: true });

@Component({
  selector: 'app-search-route',
  templateUrl: './search-route.component.html',
  styleUrls: ['./search-route.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [NzButtonModule, NzInputModule, FormsModule, NgIf, NzIconModule, NzEmptyModule, NgFor, NzGridModule, NzDividerModule]
})
export class SearchRouteComponent extends BasicConfirmModalComponent implements OnInit, AfterViewInit {
  isNightTheme$ = this.themeService.getIsNightTheme();
  resultListShow: ResultItem[] = [];
  resultList: ResultItem[] = [];
  @ViewChild('searchInput') searchInput!: ElementRef<HTMLInputElement>;
  inputValue: string | null = null;
  menuNavList: MenuOption[] = [];
  destroyRef = inject(DestroyRef);
  constructor(
    private themeService: ThemeService,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone,
    private menuStoreService: MenuStoreService,
    private router: Router,
    protected override modalRef: NzModalRef
  ) {
    super(modalRef);
  }

  changeSelAnswerIndex(dir: 'up' | 'down'): number | null {
    const index = this.resultListShow.findIndex(item => item.selItem);
    if (index > -1) {
      // up
      if (dir === 'up') {
        if (index === 0) {
          return this.resultListShow.length - 1;
        } else {
          return index - 1;
        }
      } else {
        if (index === this.resultListShow.length - 1) {
          return 0;
        } else {
          return index + 1;
        }
      }
    } else {
      return null;
    }
  }

  @HostListener('window:keyup.enter')
  onEnterUp(): void {
    const index = this.resultListShow.findIndex(item => item.selItem);
    if (index > -1) {
      this.resultClick(this.resultListShow[index]);
    }
  }

  @HostListener('window:keyup.arrowUp')
  onArrowUp(): void {
    const index = this.changeSelAnswerIndex('up');
    if (index !== null) {
      this.mouseOverItem(this.resultListShow[index]);
    }
  }

  @HostListener('window:keyup.arrowDown')
  onArrowDown(): void {
    const index = this.changeSelAnswerIndex('down');
    if (index !== null) {
      this.mouseOverItem(this.resultListShow[index]);
    }
  }

  resultClick(resultItem: ResultItem): void {
    this.router.navigate([resultItem.routePath]);
    this.modalRef.destroy();
  }

  getResultItem(menu: MenuOption, fatherTitle: string = ''): ResultItem[] {
    const fatherTitleTemp = fatherTitle === '' ? menu.menuName : `${fatherTitle} > ${menu.menuName}`;
    let resultItem: ResultItem = {
      title: fatherTitleTemp,
      routePath: menu.path!,
      selItem: false,
      isAliIcon: !!menu.alIcon,
      icon: menu.icon! || menu.alIcon!
    };
    if (menu.children && menu.children.length > 0) {
      let resultArrayTemp: ResultItem[] = [];
      menu.children.forEach(menuChild => {
        resultArrayTemp = [...resultArrayTemp, ...this.getResultItem(menuChild, fatherTitleTemp)];
      });
      return resultArrayTemp;
    } else {
      return [resultItem];
    }
  }

  resultListFactory(): void {
    let temp: ResultItem[] = [];
    this.menuNavList.forEach(item => {
      temp = [...temp, ...this.getResultItem(item)];
    });
    this.resultList = temp;
  }

  clearInput(): void {
    this.inputValue = '';
    this.resultListShow = [];
    this.cdr.markForCheck();
  }

  subSearchFn(): void {
    this.ngZone.runOutsideAngular(() => {
      fromEvent(this.searchInput.nativeElement, 'input', passiveEventListenerOptions)
        .pipe(
          map(e => (e.target as HTMLInputElement).value),
          debounceTime(500),
          distinctUntilChanged(),
          switchMap(item => {
            return of(item);
          }),
          takeUntilDestroyed(this.destroyRef)
        )
        .subscribe(res => {
          this.resultListShow = [];
          this.resultList.forEach(item => {
            if (item.title.includes(res)) {
              this.resultListShow.push(item);
            }
          });
          if (this.resultListShow.length > 0) {
            this.resultListShow[0].selItem = true;
          }
          this.resultListShow = [...this.resultListShow];
          // Empty the result set when clearing search criteria
          if (!res) {
            this.resultListShow = [];
          }
          this.ngZone.run(() => {
            this.cdr.markForCheck();
          });
        });
    });
  }

  mouseOverItem(item: ResultItem): void {
    this.resultListShow.forEach(resultItem => {
      resultItem.selItem = false;
    });
    item.selItem = true;
  }

  ngAfterViewInit(): void {
    this.subSearchFn();
  }

  getMenus(): void {
    this.menuStoreService
      .getMenuArrayStore()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(menus => {
        this.menuNavList = menus;
      });
  }

  ngOnInit(): void {
    this.getMenus();
    this.resultListFactory();
  }

  protected getCurrentValue(): NzSafeAny {}
}
