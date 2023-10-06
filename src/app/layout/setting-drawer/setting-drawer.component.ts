import { CdkDrag } from '@angular/cdk/drag-drop';
import { DOCUMENT, NgIf, NgFor } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject, OnInit, Renderer2 } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { first } from 'rxjs/operators';

import { ThemeOption } from '@app/core/services/types';
import { InitTheme, IsNightKey, ThemeOptionKey } from '@config/constant';
import { LoginInOutService } from '@core/services/common/login-in-out.service';
import { SimpleReuseStrategy } from '@core/services/common/reuse-strategy';
import { TabService } from '@core/services/common/tab.service';
import { ThemeSkinService } from '@core/services/common/theme-skin.service';
import { WindowService } from '@core/services/common/window.service';
import { ThemeService } from '@store/common-store/theme.service';
import { fnFormatToHump } from '@utils/tools';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzConfigService } from 'ng-zorro-antd/core/config';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';

interface NormalModel {
  image?: string;
  title: string;
  isChecked: boolean;
}

export interface Theme extends NormalModel {
  key: 'dark' | 'light';
}

type SpecialTheme = 'color-weak' | 'grey-theme';
type SpecialThemeHump = 'colorWeak' | 'greyTheme';

interface Color extends NormalModel {
  key: string;
  color: string;
}

export interface ThemeMode extends NormalModel {
  key: 'side' | 'top' | 'mixi';
}

@Component({
  selector: 'app-setting-drawer',
  templateUrl: './setting-drawer.component.html',
  styleUrls: ['./setting-drawer.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CdkDrag, NgIf, NzIconModule, NzButtonModule, NzDrawerModule, NgFor, NzToolTipModule, NzDividerModule, NzListModule, NzSwitchModule, FormsModule]
})
export class SettingDrawerComponent implements OnInit {
  themeOption$ = this.themeService.getThemeMode();
  isNightTheme$ = this.themeService.getIsNightTheme();
  _isNightTheme = false;
  _themeOption: ThemeOption = InitTheme;
  isCollapsed = false;
  dragging = false;

  themes: Theme[] = [
    {
      key: 'dark',
      image: '/assets/images/theme-dark.svg',
      title: 'Dark menu style',
      isChecked: true
    },
    {
      key: 'light',
      image: '/assets/images/theme-light.svg',
      title: 'Bright menu style',
      isChecked: false
    }
  ];
  colors: Color[] = [
    {
      key: 'dust',
      color: '#F5222D',
      title: 'Dusk',
      isChecked: false
    },
    {
      key: 'volcano',
      color: '#FA541C',
      title: 'Volcano',
      isChecked: false
    },
    {
      key: 'sunset',
      color: '#FAAD14',
      title: 'Sunset',
      isChecked: false
    },
    {
      key: 'cyan',
      color: '#13C2C2',
      title: 'Cyan',
      isChecked: false
    },
    {
      key: 'green',
      color: '#52C41A',
      title: 'Green',
      isChecked: false
    },
    {
      key: 'daybreak',
      color: '#1890FF',
      title: 'Dawn blue (default)',
      isChecked: true
    },
    {
      key: 'geekblue',
      color: '#2F54EB',
      title: 'Geekblue',
      isChecked: false
    },
    {
      key: 'purple',
      color: '#722ED1',
      title: 'Purple',
      isChecked: false
    }
  ];
  modes: ThemeMode[] = [
    {
      key: 'side',
      image: '/assets/images/menu-side.svg',
      title: 'Side menu layout',
      isChecked: true
    },
    {
      key: 'top',
      image: '/assets/images/menu-top.svg',
      title: 'Top menu layout',
      isChecked: false
    },
    {
      key: 'mixi',
      image: '/assets/images/menu-top.svg',
      title: 'Mixed menu layout',
      isChecked: false
    }
  ];

  constructor(
    private activatedRoute: ActivatedRoute,
    public message: NzMessageService,
    private rd2: Renderer2,
    private themeService: ThemeService,
    private tabService: TabService,
    private nzConfigService: NzConfigService,
    private themeSkinService: ThemeSkinService,
    private windowService: WindowService,
    private loginInOutService: LoginInOutService,
    @Inject(DOCUMENT) private doc: Document
  ) {}

  changeCollapsed(): void {
    if (!this.dragging) {
      this.isCollapsed = !this.isCollapsed;
    } else {
      this.dragging = false;
    }
  }

  changePrimaryColor(color: Color): void {
    this.selOne(color as NormalModel, this.colors);
    this.nzConfigService.set('theme', { primaryColor: color.color });
    this._themeOption.color = color.color;
    this.setThemeOption();
  }

  // Modify the night theme
  changeNightTheme(isNight: boolean): void {
    this.windowService.setStorage(IsNightKey, `${isNight}`);
    this.themeService.setIsNightTheme(isNight);
    this.themeSkinService.toggleTheme().then();
  }

  // Select one isChecked to be true and the others to be false
  selOne(item: NormalModel, itemArray: NormalModel[]): void {
    itemArray.forEach(_item => (_item.isChecked = false));
    item.isChecked = true;
  }

  changeMode(mode: ThemeMode): void {
    this.selOne(mode, this.modes);
    this.themeService.setIsCollapsed(false);
    this._themeOption.mode = mode.key;
    this.setThemeOption();
  }

  // switch theme
  changeTheme(themeItem: Theme): void {
    this.selOne(themeItem, this.themes);
    this._themeOption.theme = themeItem.key;
    this.setThemeOption();
  }

  // Set theme parameters
  setThemeOption(): void {
    this.themeService.setThemeMode(this._themeOption);
    this.windowService.setStorage(ThemeOptionKey, JSON.stringify(this._themeOption));
  }

  // Modify fixed header
  changeFixed(isTrue: boolean, type: 'isShowTab' | 'splitNav' | 'fixedTab' | 'fixedLeftNav' | 'fixedHead' | 'hasTopArea' | 'hasFooterArea' | 'hasNavArea' | 'hasNavHeadArea'): void {
    // When the header is not fixed, the set label is not fixed either.
    if (type === 'fixedHead' && !isTrue) {
      this._themeOption['fixedTab'] = false;
    }
    this._themeOption[type] = isTrue;
    this.setThemeOption();

    // If multiple tabs are not displayed, the tab and all components that have been cached must be cleared.
    if (type === 'isShowTab') {
      if (!isTrue) {
        SimpleReuseStrategy.deleteAllRouteSnapshot(this.activatedRoute.snapshot).then(() => {
          this.tabService.clearTabs();
        });
      } else {
        this.tabService.refresh();
      }
    }
  }

  // Modify special themes, color weak themes, gray themes
  changeSpecialTheme(e: boolean, themeType: SpecialTheme): void {
    const name = this.doc.getElementsByTagName('html');
    const theme = fnFormatToHump(themeType);
    if (e) {
      this.rd2.addClass(name[0], themeType);
    } else {
      this.rd2.removeClass(name[0], themeType);
    }
    this._themeOption[theme as SpecialThemeHump] = e;
    this.setThemeOption();
  }

  initThemeOption(): void {
    this.isNightTheme$.pipe(first()).subscribe(res => (this._isNightTheme = res));
    this.themeOption$.pipe(first()).subscribe(res => {
      this._themeOption = res;
    });

    // Special mode theme transformation (color weak mode, gray mode)
    (['grey-theme', 'color-weak'] as SpecialTheme[]).forEach(item => {
      const specialTheme = fnFormatToHump(item);
      this.changeSpecialTheme(this._themeOption[specialTheme as SpecialThemeHump], item);
    });

    this.modes.forEach(item => {
      item.isChecked = item.key === this._themeOption.mode;
    });
    this.colors.forEach(item => {
      item.isChecked = item.color === this._themeOption.color;
    });
    this.changePrimaryColor(this.colors.find(item => item.isChecked)!);
    this.themes.forEach(item => {
      item.isChecked = item.key === this._themeOption.theme;
    });
  }

  ngOnInit(): void {
    this.initThemeOption();
  }

  dragEnd(): void {
    if (this.dragging) {
      setTimeout(() => {
        this.dragging = false;
      });
    }
  }
}
