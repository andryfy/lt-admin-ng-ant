import { Component, OnInit, ChangeDetectionStrategy, inject, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs/operators';

import { AuthService } from '@app/core/services/common/auth.service';
import { LoginInOutService } from '@core/services/common/login-in-out.service';
import { WindowService } from '@core/services/common/window.service';
import { LoginService } from '@core/services/http/login/login.service';
import { MenuStoreService } from '@store/common-store/menu-store.service';
import { SpinService } from '@store/common-store/spin.service';
import { UserInfoService } from '@store/common-store/userInfo.service';
import { fnCheckForm } from '@utils/tools';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzWaveModule } from 'ng-zorro-antd/core/wave';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzNotificationModule, NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTabsModule } from 'ng-zorro-antd/tabs';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [FormsModule, NzFormModule, ReactiveFormsModule, NzTabsModule, NzGridModule, NzButtonModule, NzInputModule, NzWaveModule, NzCheckboxModule, NzIconModule, RouterLink, NzNotificationModule]
})
export class LoginFormComponent implements OnInit {
  validateForm!: FormGroup;
  destroyRef = inject(DestroyRef);
  constructor(
    private fb: FormBuilder,
    private loginInOutService: LoginInOutService,
    private authService: AuthService,
    private spinService: SpinService,
    private notification: NzNotificationService,
    private router: Router
  ) {}

  submitForm(): void {
    // Validation form
    if (!fnCheckForm(this.validateForm)) {
      return;
    }
    // Set global loading
    this.spinService.setCurrentGlobalSpinStore(true);
    // Get form value
    const body = this.validateForm.getRawValue();
    // Call the login interface
    // TODO: The login backend returns to the unified mode. If the code is not 0, it will be automatically intercepted. If you need to modify it, please modify it in src/app/core/services/http/base-http.service.ts
    // {
    //   code:number,
    //   data:any,
    //   msg：string
    // }
    this.authService
      .signIn(body)
      .pipe(
        // Anyway set global loading to false
        finalize(() => {
          this.spinService.setCurrentGlobalSpinStore(false);
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(userToken => {
        // After successful backend login here, only a set of tokens encrypted by jwt will be returned. The tokens need to be parsed below.
        this.spinService.setCurrentGlobalSpinStore(false);
        this.notification.blank(
          'Kind tips',
          `A real example of addition, deletion, modification and query was made under the "System Management" menu. The data is reset every 10 minutes, so you can operate with confidence.
            <br>
            I build the server at my own expense every year. If this project is useful to you, please give me a free github star to encourage me. Thank you very much!
            Source address:<a href="https://github.com/andryfy/lt-admin-ng-ant">it's here</a>
        `,
          {
            nzDuration: 0
          }
        );
      });
  }

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      username: [null, [Validators.required]],
      password: [null, [Validators.required]]
    });
  }
}
