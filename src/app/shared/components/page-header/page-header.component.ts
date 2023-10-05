import { NgFor, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnInit, Output, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';

import { ThemeService } from '@store/common-store/theme.service';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { NzOutletModule } from 'ng-zorro-antd/core/outlet';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';

export interface PageHeaderType {
  title: string;
  desc: string | TemplateRef<NzSafeAny>;
  extra: string | TemplateRef<NzSafeAny>;
  breadcrumb: string[];
  footer: string | TemplateRef<NzSafeAny>;
}

@Component({
  selector: 'app-page-header',
  templateUrl: './page-header.component.html',
  styleUrls: ['./page-header.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [NzPageHeaderModule, NzBreadCrumbModule, NgFor, NzOutletModule, NgIf]
})
export class PageHeaderComponent implements OnInit {
  @Input() backTpl: TemplateRef<NzSafeAny> | undefined;
  @Input() pageHeaderInfo: Partial<PageHeaderType> = {};
  @Input() backUrl = '';
  themeOption$ = this.themeService.getThemeMode();

  constructor(private themeService: ThemeService, private router: Router) {}

  back(): void {
    this.router.navigateByUrl(this.backUrl);
  }

  ngOnInit(): void {}
}
