import { Component, ChangeDetectionStrategy, inject, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';

import { LockScreenFlag, LockScreenStoreService } from '@store/common-store/lock-screen-store.service';

/*This component creates a blank page in order to solve the problem that f12 can still view the hidden page when the screen is locked*/

@Component({
  selector: 'app-empty-for-lock',
  template: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true
})
export class EmptyForLockComponent {
  // Router’s lock screen status
  routeStatus!: LockScreenFlag;
  destroyRef = inject(DestroyRef);

  constructor(private router: Router, private lockScreenStoreService: LockScreenStoreService) {
    this.lockScreenStoreService
      .getLockScreenStore()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(res => {
        this.routeStatus = res;
      });
  }
}
