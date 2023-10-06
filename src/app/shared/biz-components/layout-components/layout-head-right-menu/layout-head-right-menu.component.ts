import { NgTemplateOutlet, NgIf, NgFor } from '@angular/common';
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { LangList } from '@app/config/constant';
import { OptionInterface } from '@app/core/services/types';
import { LoginInOutService } from '@core/services/common/login-in-out.service';
import { WindowService } from '@core/services/common/window.service';
import { AccountService, UserPassword } from '@http/system/account.service';
import { ScreenLessHiddenDirective } from '@shared/directives/screen-less-hidden.directive';
import { ToggleFullscreenDirective } from '@shared/directives/toggle-fullscreen.directive';
import { SpinService } from '@store/common-store/spin.service';
import { UserInfoService } from '@store/common-store/userInfo.service';
import { ModalBtnStatus } from '@widgets/base-modal';
import { ChangePasswordService } from '@widgets/biz-widget/change-password/change-password.service';
import { LockWidgetService } from '@widgets/common-widget/lock-widget/lock-widget.service';
import { SearchRouteService } from '@widgets/common-widget/search-route/search-route.service';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ModalOptions } from 'ng-zorro-antd/modal';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';

import { HomeNoticeComponent } from '../home-notice/home-notice.component';

@Component({
  selector: 'app-layout-head-right-menu',
  templateUrl: './layout-head-right-menu.component.html',
  styleUrls: ['./layout-head-right-menu.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    NgIf,
    NgFor,
    NgTemplateOutlet,
    ScreenLessHiddenDirective,
    NzToolTipModule,
    NzIconModule,
    NzButtonModule,
    NzDropDownModule,
    NzBadgeModule,
    NzMenuModule,
    NzAvatarModule,
    ToggleFullscreenDirective,
    HomeNoticeComponent
  ]
})
export class LayoutHeadRightMenuComponent implements OnInit {
  langList: OptionInterface[] = LangList;

  user!: UserPassword;

  constructor(
    private router: Router,
    private changePasswordModalService: ChangePasswordService,
    private spinService: SpinService,
    private loginOutService: LoginInOutService,
    private lockWidgetService: LockWidgetService,
    private windowService: WindowService,
    private activatedRoute: ActivatedRoute,
    private searchRouteService: SearchRouteService,
    public message: NzMessageService,
    private userInfoService: UserInfoService,
    private accountService: AccountService
  ) {}

  // lock screen
  lockScreen(): void {
    this.lockWidgetService
      .show({
        nzTitle: 'Lock Screen',
        nzStyle: { top: '25px' },
        nzWidth: '520px',
        nzFooter: null,
        nzMaskClosable: true
      })
      .subscribe();
  }

  // change Password
  changePassWorld(): void {
    this.changePasswordModalService.show({ nzTitle: 'change Password' }).subscribe(({ modalValue, status }) => {
      if (status === ModalBtnStatus.Cancel) {
        return;
      }
      this.userInfoService.getUserInfo().subscribe(res => {
        this.user = {
          id: res.userId,
          oldPassword: modalValue.oldPassword,
          newPassword: modalValue.newPassword
        };
      });
      this.accountService.editAccountPsd(this.user).subscribe(() => {
        this.loginOutService.loginOut().then();
        this.message.success('Modification successful, please log in again');
      });
    });
  }

  showSearchModal(): void {
    const modalOptions: ModalOptions = {
      nzClosable: false,
      nzMaskClosable: true,
      nzStyle: { top: '48px' },
      nzFooter: null,
      nzBodyStyle: { padding: '0' }
    };
    this.searchRouteService.show(modalOptions);
  }

  goLogin(): void {
    this.loginOutService.loginOut().then();
  }

  clean(): void {
    this.windowService.clearStorage();
    this.windowService.clearSessionStorage();
    this.loginOutService.loginOut().then();
    this.message.success('Cleared successfully, please log in again');
  }

  switchLang(language: OptionInterface): void {
    this.message.info(`Language switch successful to ${language.label} (${language.value})`);
  }

  goPage(path: string): void {
    this.router.navigateByUrl(`/default/page-demo/personal/${path}`);
  }

  ngOnInit(): void {}
}
