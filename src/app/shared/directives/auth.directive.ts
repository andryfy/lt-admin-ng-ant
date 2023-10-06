import { Directive, Input, TemplateRef, ViewContainerRef, inject } from '@angular/core';

import { UserInfo, AuthService } from '@app/core/services/common/auth.service';
import { UserInfoService } from '@store/common-store/userInfo.service';
import { NzSafeAny } from 'ng-zorro-antd/core/types';

@Directive({
  selector: '[appAuth]',
  standalone: true
})
export class AuthDirective {
  private templateRef: TemplateRef<NzSafeAny> = inject(TemplateRef<NzSafeAny>);
  private viewContainerRef: ViewContainerRef = inject(ViewContainerRef);
  private authService: AuthService = inject(AuthService);

  user!: UserInfo;

  @Input('appAuth')
  set appAuth(authCode: string | undefined) {
    if (!authCode) {
      this.show(true);
      return;
    }
    authCode === this.user.role ? this.show(true) : this.show(false);
  }

  constructor() {
    this.user = this.authService.userStorage;
  }

  private show(hasAuth: boolean): void {
    hasAuth ? this.viewContainerRef.createEmbeddedView(this.templateRef) : this.viewContainerRef.clear();
  }
}
