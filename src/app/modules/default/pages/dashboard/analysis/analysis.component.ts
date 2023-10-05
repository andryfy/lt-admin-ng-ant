import { NgFor } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, DestroyRef, inject, NgZone, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { Chart } from '@antv/g2';
import { Pie, RingProgress, TinyColumn, TinyArea, Progress } from '@antv/g2plot';
import { NumberLoopPipe } from '@shared/pipes/number-loop.pipe';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { inNextTick } from 'ng-zorro-antd/core/util';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzTypographyModule } from 'ng-zorro-antd/typography';

interface DataItem {
  name: string;
  chinese: number;
  math: number;
  english: number;
}

@Component({
  selector: 'app-analysis',
  templateUrl: './analysis.component.html',
  styleUrls: ['./analysis.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    NzCardModule,
    NzBreadCrumbModule,
    NzGridModule,
    NzIconModule,
    NzButtonModule,
    NzToolTipModule,
    NzDividerModule,
    NzTabsModule,
    NgFor,
    NzBadgeModule,
    NzRadioModule,
    NzDatePickerModule,
    NzTypographyModule,
    NzTableModule,
    NumberLoopPipe
  ]
})
export class AnalysisComponent implements OnInit, AfterViewInit {
  destroyRef = inject(DestroyRef);
  cardPadding = { padding: '20px 24px 8px' };
  miniBarData = [497, 666, 219, 269, 274, 337, 81, 497, 666, 219, 269];
  miniAreaData = [264, 274, 284, 294, 284, 274, 264, 264, 274, 264, 264, 264, 284, 264, 254, 264, 244, 340, 264, 243, 226, 192];
  histogramData = [
    { type: 'January', value: 769 },
    { type: 'February', value: 769 },
    { type: 'March', value: 861 },
    { type: 'April', value: 442 },
    { type: 'May', value: 555 },
    { type: 'June', value: 439 },
    { type: 'July', value: 590 },
    { type: 'August', value: 434 },
    { type: 'September', value: 843 },
    { type: 'October', value: 840 },
    { type: 'November', value: 769 },
    { type: 'December', value: 769 }
  ];
  ringData = [
    { type: 'Category 1', value: 27 },
    { type: 'Classification 2', value: 25 },
    { type: 'Category 3', value: 18 },
    { type: 'Category Four', value: 15 },
    { type: 'Category five', value: 10 },
    { type: 'other', value: 5 }
  ];

  listOfColumn = [
    {
      title: 'Ranking',
      compare: null,
      priority: false
    },
    {
      title: 'Search keyword',
      compare: (a: DataItem, b: DataItem) => a.chinese - b.chinese,
      priority: 3
    },
    {
      title: 'Number of users',
      compare: (a: DataItem, b: DataItem) => a.math - b.math,
      priority: 2
    },
    {
      title: 'Weekly increase',
      compare: (a: DataItem, b: DataItem) => a.english - b.english,
      priority: 1
    }
  ];
  listOfData: DataItem[] = [
    {
      name: 'John Brown',
      chinese: 98,
      math: 60,
      english: 70
    },
    {
      name: 'John Brown',
      chinese: 98,
      math: 60,
      english: 70
    },
    {
      name: 'Jim Green',
      chinese: 98,
      math: 66,
      english: 89
    },
    {
      name: 'Joe Black',
      chinese: 98,
      math: 90,
      english: 70
    },
    {
      name: 'Jim Red',
      chinese: 88,
      math: 99,
      english: 89
    }
  ];

  constructor(private cdr: ChangeDetectorRef, private ngZone: NgZone) {}

  ngOnInit(): void {}

  initMinibar(): void {
    const data = this.miniBarData;
    const tinyColumn = new TinyColumn('miniBar', {
      autoFit: true,
      height: 14,
      width: 200,
      data
    });

    tinyColumn.render();
  }

  initMiniArea(): void {
    const data = this.miniAreaData;
    const tinyArea = new TinyArea('miniArea', {
      autoFit: true,
      height: 14,
      width: 200,
      data,
      smooth: true,
      areaStyle: {
        fill: '#d6e3fd'
      }
    });

    tinyArea.render();
  }

  initProgress(): void {
    const progress = new Progress('progress', {
      height: 14,
      width: 200,
      autoFit: true,
      percent: 0.7,
      color: ['#5B8FF9', '#E8EDF3']
    });

    progress.render();
  }

  initHistogram(): void {
    const chart = new Chart({
      container: 'histogram',
      autoFit: true,
      height: 295,
      padding: [40, 40, 32, 72]
    });
    chart.data(this.histogramData);
    chart.scale('value', {
      nice: true
    });
    chart.axis('type', {
      tickLine: null
    });

    chart.axis('value', {
      label: {
        formatter: val => {
          return +val;
        }
      }
    });

    chart.tooltip({
      showMarkers: false
    });
    chart.interaction('element-active');

    chart.legend(false);
    chart
      .interval()
      .position('type*value')
      .color('type', val => {
        if (val.includes('10-30') || val.includes('30+')) {
          return '#ff4d4f';
        }
        return '#2194ff';
      })
      .label('value', {
        offset: 10
      });
    chart.render();
  }

  initSearchArea(): void {
    const data = this.miniAreaData;
    const tinyArea = new TinyArea('searchUserChart', {
      autoFit: true,
      height: 30,
      data,
      smooth: true,
      areaStyle: {
        fill: '#d6e3fd'
      }
    });
    tinyArea.render();
  }

  initSearchAvgArea(): void {
    const data = this.miniAreaData;
    const tinyArea = new TinyArea('searchUserAvgChart', {
      autoFit: true,
      height: 30,
      data,
      smooth: true,
      areaStyle: {
        fill: '#d6e3fd'
      }
    });
    tinyArea.render();
  }

  initRing(): void {
    const tinyArea = new Pie('ringPie', {
      appendPadding: 10,
      data: this.ringData,
      angleField: 'value',
      colorField: 'type',
      radius: 1,
      innerRadius: 0.64,
      meta: {
        value: {
          formatter: v => `${v} ¥`
        }
      },
      label: {
        type: 'inner',
        offset: '-50%',
        style: {
          textAlign: 'center'
        },
        autoRotate: false,
        content: '{value}'
      },
      statistic: {},
      // add central statistics text interaction
      interactions: [{ type: 'element-selected' }, { type: 'element-active' }, { type: 'pie-statistic-active' }]
    });
    tinyArea.render();
  }

  initMiniRing(): void {
    const ringProgress = new RingProgress('miniRing', {
      height: 45,
      width: 45,
      autoFit: false,
      percent: 0.7,
      color: ['#5B8FF9', '#E8EDF3']
    });

    ringProgress.render();
  }

  ngAfterViewInit(): void {
    inNextTick()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.ngZone.runOutsideAngular(() => {
          this.initMinibar();
          this.initMiniArea();
          this.initProgress();
          this.initHistogram();
          this.initSearchArea();
          this.initSearchAvgArea();
          this.initRing();
          // this.initMiniRing();
        });
      });
  }
}
