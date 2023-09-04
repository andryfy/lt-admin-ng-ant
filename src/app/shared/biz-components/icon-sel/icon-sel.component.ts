import { NgIf, NgFor, NgStyle } from '@angular/common';
import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, Input, Output, EventEmitter, AfterViewInit, inject, DestroyRef, booleanAttribute } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

import { zorroIcons } from '@shared/biz-components/icon-sel/zorro-icons';
import { fnKebabCase } from '@utils/camelFn';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzPopoverModule } from 'ng-zorro-antd/popover';

interface IconItem {
  icon: string;
  isChecked: boolean;
}

@Component({
  selector: 'app-icon-sel',
  templateUrl: './icon-sel.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [NzIconModule, NzButtonModule, NzPopoverModule, NzInputModule, NzCardModule, NgIf, NgFor, NgStyle, NzEmptyModule, NzPaginationModule]
})
export class IconSelComponent implements OnInit, AfterViewInit {
  @Input({ transform: booleanAttribute }) visible = false;
  // Do icon search for anti-shake
  private searchText$ = new Subject<string>();
  seletedIcon = '';
  @Output() readonly selIcon = new EventEmitter<string>();
  // Pagination information
  pageObj = {
    pageSize: 50,
    pageNum: 1
  };
  // All results from the icon search
  iconsStrAllArray: IconItem[] = [];
  sourceIconsArray: IconItem[] = []; // The data source of all icons
  iconsStrShowArray: IconItem[] = []; // icon displayed on each page
  gridStyle = {
    width: '20%'
  };
  destroyRef = inject(DestroyRef);

  constructor(private cdr: ChangeDetectorRef) {
    zorroIcons.forEach(item => {
      this.sourceIconsArray.push({ icon: fnKebabCase(item), isChecked: false });
    });
    this.iconsStrAllArray = JSON.parse(JSON.stringify(this.sourceIconsArray));
  }

  searchIcon(e: Event): void {
    this.searchText$.next((e.target as HTMLInputElement).value);
  }

  selIconFn(item: IconItem): void {
    this.seletedIcon = item.icon;
    this.sourceIconsArray.forEach(icon => (icon.isChecked = false));
    this.iconsStrShowArray.forEach(icon => (icon.isChecked = false));
    this.iconsStrAllArray.forEach(icon => (icon.isChecked = false));

    item.isChecked = true;
    this.selIcon.emit(item.icon);
  }

  pageSizeChange(event: number): void {
    this.pageObj = { ...this.pageObj, pageSize: event };
    this.getData(1);
  }

  // Get data in pages
  getData(event: number = this.pageObj.pageNum): void {
    this.pageObj = { ...this.pageObj, pageNum: event };
    this.iconsStrShowArray = [...this.iconsStrAllArray.slice((this.pageObj.pageNum - 1) * this.pageObj.pageSize, this.pageObj.pageNum * this.pageObj.pageSize)];
    this.cdr.markForCheck();
  }

  ngOnInit(): void {
    this.getData();
  }

  ngAfterViewInit(): void {
    this.searchText$.pipe(debounceTime(200), distinctUntilChanged(), takeUntilDestroyed(this.destroyRef)).subscribe(res => {
      this.iconsStrAllArray = this.sourceIconsArray.filter(item => item.icon.includes(res));
      this.getData();
      this.cdr.markForCheck();
    });
  }
}
