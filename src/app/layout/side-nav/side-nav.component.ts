import { NgIf, AsyncPipe } from '@angular/common';
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Observable } from 'rxjs';

import { ThemeService } from '@store/common-store/theme.service';

import { NavBarComponent } from '../nav-bar/nav-bar.component';

@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [NgIf, NavBarComponent, AsyncPipe]
})
export class SideNavComponent implements OnInit {
  themeOption$ = this.themeService.getThemeMode();
  isNightTheme$ = this.themeService.getIsNightTheme();
  isCollapsed$: Observable<boolean> = this.themeService.getIsCollapsed();

  constructor(private themeService: ThemeService) {}

  ngOnInit(): void {}
}
