import { NgIf, NgFor, NgClass, NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, TemplateRef } from '@angular/core';

import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { NzResizeEvent, NzResizableModule } from 'ng-zorro-antd/resizable';
import { NzTableQueryParams, NzTableSize, NzTableModule } from 'ng-zorro-antd/table';

import { MapPipe } from '../../pipes/map.pipe';
import { TableFiledPipe } from '../../pipes/table-filed.pipe';
export interface TableHeader {
  title: string; // Header Name
  field?: string; // Field
  pipe?: string; // pipeline
  showSort?: boolean; // Whether to display sorting
  sortDir?: undefined | 'asc' | 'desc'; // Sorting direction
  width?: number; // cell width
  thTemplate?: TemplateRef<NzSafeAny>; // th cell template
  tdTemplate?: TemplateRef<NzSafeAny>; // td cell template
  fixed?: boolean; // Whether to fix cells (only valid if fixed continuously from the leftmost or rightmost)
  fixedDir?: 'left' | 'right'; // Whether it is fixed on the left or right, it needs to be used with fixed.
  notNeedEllipsis?: boolean; // Give true when... is not needed
  tdClassList?: string[]; // Specify a class for the td cell (the class in the parent component must be prefixed with /deep/ to take effect on the child component)
  thClassList?: string[]; // Specify a class for the th cell (the class in the parent component must be prefixed with /deep/ to take effect on the child component)
  show?: boolean; // Whether to display columns, false: not displayed, other: displayed
  tdClassFn?: (data: any, index: number) => string[];
  thClassFn?: (data: any) => string[];
}

export interface AntTableConfig {
  needNoScroll?: boolean; //Does the list require scroll bars?
  xScroll?: number; //List horizontal scroll bar
  yScroll?: number; //List vertical scroll bar
  virtualItemSize?: number; //The height of each column during virtual scrolling, same as cdk itemSize
  showCheckbox?: boolean; // If you need checkBox, you need showCheckbox=true, and when using the app-ant-table component, pass in [checkedCashArrayFromComment]="cashArray". CashArray is an array defined by yourself in the business component, and the data in the table needs to have an id attribute.
  pageIndex: number; // Current page number, (bidirectionally bound to the page number in the page)
  pageSize: number; // The number of data items displayed on each page (two-way binding with pageSize in the page)
  total: number; //The total amount of data used to calculate paging (should be obtained from the backend interface)
  loading: boolean; // Whether to display the table loading
  headers: TableHeader[]; // Column settings
}

export abstract class AntTableComponentToken {
  tableSize!: NzTableSize;
  tableConfig!: AntTableConfig;

  abstract tableChangeDectction(): void;
}

export interface SortFile {
  fileName: string;
  sortDir: undefined | 'desc' | 'asc';
}

@Component({
  selector: 'app-ant-table',
  templateUrl: './ant-table.component.html',
  styleUrls: ['./ant-table.component.less'],
  providers: [{ provide: AntTableComponentToken, useExisting: AntTableComponent }],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [NzTableModule, NgIf, NgFor, NzResizableModule, NgClass, NgTemplateOutlet, MapPipe, TableFiledPipe]
})
export class AntTableComponent implements OnInit, OnChanges {
  _dataList!: NzSafeAny[];
  _tableConfig!: AntTableConfig;
  _scrollConfig: { x: string; y: string } | {} = {};
  // The cached checked checkbox data array passed in from the business component
  @Input() checkedCashArrayFromComment: NzSafeAny[] = [];

  @Input()
  set tableData(value: NzSafeAny[]) {
    this._dataList = value;
    if (this.tableConfig.showCheckbox) {
      this._dataList.forEach(item => {
        item['_checked'] = false;
      });
    }
  }

  get tableData(): NzSafeAny[] {
    return this._dataList;
  }

  _tableSize: NzTableSize = 'default';
  set tableSize(value: NzTableSize) {
    this._tableSize = value;
    this.tableChangeDectction();
  }

  get tableSize(): NzTableSize {
    return this._tableSize;
  }

  @Input()
  set tableConfig(value: AntTableConfig) {
    this._tableConfig = value;
    this.setScrollConfig(value);
  }

  get tableConfig(): AntTableConfig {
    return this._tableConfig;
  }

  @Output() readonly changePageNum = new EventEmitter<NzTableQueryParams>();
  @Output() readonly changePageSize = new EventEmitter<number>();
  @Output() readonly selectedChange: EventEmitter<NzSafeAny[]> = new EventEmitter<NzSafeAny[]>();
  @Output() readonly sortFn: EventEmitter<SortFile> = new EventEmitter<SortFile>();
  indeterminate: boolean = false;
  allChecked: boolean = false;

  constructor(private cdr: ChangeDetectorRef) {}

  setScrollConfig(value: AntTableConfig): void {
    if (value && !value.needNoScroll) {
      // Default x: 100
      this._scrollConfig = { x: '100px' };
      let tempX = {};
      if (value.xScroll !== undefined) {
        tempX = { x: `${value.xScroll}px` };
      }
      let tempY = {};
      if (value.yScroll !== undefined) {
        tempY = { y: `${value.yScroll}px` };
      }
      this._scrollConfig = { ...this._scrollConfig, ...tempX, ...tempY };
    } else {
      this._scrollConfig = {};
    }
  }

  changeSort(tableHeader: TableHeader): void {
    this.tableConfig.headers.forEach(item => {
      if (item.field !== tableHeader.field) {
        item.sortDir = undefined;
      }
    });
    const sortDicArray: [undefined, 'asc', 'desc'] = [undefined, 'asc', 'desc'];
    const index = sortDicArray.findIndex(item => item === tableHeader.sortDir);
    tableHeader.sortDir = index === sortDicArray.length - 1 ? sortDicArray[0] : sortDicArray[index + 1];
    this.sortFn.emit({ fileName: tableHeader.field!, sortDir: tableHeader.sortDir });
  }

  tableChangeDectction(): void {
    // Changing the reference triggers change detection.
    this._dataList = [...this._dataList];
    this.cdr.markForCheck();
  }

  trackById(_: number, data: { id: number }): number {
    return data.id;
  }

  public trackByTableHead(index: number, item: NzSafeAny): NzSafeAny {
    return item;
  }

  public trackByTableBody(index: number, item: NzSafeAny): NzSafeAny {
    return item;
  }

  // Pagination page number change
  onQueryParamsChange(tableQueryParams: NzTableQueryParams): void {
    this.changePageNum.emit(tableQueryParams);
  }

  // Modify the page numbers of several items on a page
  onPageSizeChange($event: NzSafeAny): void {
    this.changePageSize.emit($event);
  }

  onResize({ width }: NzResizeEvent, col: string): void {
    this.tableConfig.headers = this.tableConfig.headers.map(e =>
      e.title === col
        ? {
            ...e,
            width: +`${width}`
          }
        : e
    ) as TableHeader[];
  }

  checkFn(dataItem: NzSafeAny, isChecked: boolean): void {
    dataItem['_checked'] = isChecked;
    const index = this.checkedCashArrayFromComment.findIndex(cashItem => cashItem.id === dataItem.id);
    if (isChecked) {
      if (index === -1) {
        this.checkedCashArrayFromComment.push(dataItem);
      }
    } else {
      if (index !== -1) {
        this.checkedCashArrayFromComment.splice(index, 1);
      }
    }
  }

  // Single choice
  public checkRowSingle(isChecked: boolean, selectIndex: number): void {
    this.checkFn(this._dataList[selectIndex], isChecked);
    this.selectedChange.emit(this.checkedCashArrayFromComment);
    this.refreshStatus();
  }

  // select all
  onAllChecked(isChecked: boolean): void {
    this._dataList.forEach(item => {
      this.checkFn(item, isChecked);
    });
    this.selectedChange.emit(this.checkedCashArrayFromComment);
    this.refreshStatus();
  }

  // Refresh checkbox state
  refreshStatus(): void {
    this._dataList.forEach(item => {
      const index = this.checkedCashArrayFromComment.findIndex(cashItem => {
        return item.id === cashItem.id;
      });
      item['_checked'] = index !== -1;
    });
    const allChecked =
      this._dataList.length > 0 &&
      this._dataList.every(item => {
        return item['_checked'] === true;
      });
    const allUnChecked = this._dataList.every(item => item['_checked'] !== true);
    this.allChecked = allChecked;
    this.indeterminate = !allChecked && !allUnChecked;
  }

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['checkedCashArrayFromComment']) {
      this.refreshStatus();
    }
  }
}
