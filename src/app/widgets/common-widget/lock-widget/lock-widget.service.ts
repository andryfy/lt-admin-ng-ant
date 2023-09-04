import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ModalWrapService } from '@widgets/base-modal';
import { LockWidgetComponent } from '@widgets/common-widget/lock-widget/lock-widget.component';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { ModalOptions } from 'ng-zorro-antd/modal';

@Injectable({
  providedIn: 'root'
})
export class LockWidgetService {
  constructor(private modalWrapService: ModalWrapService) {}

  protected getContentComponent(): NzSafeAny {
    return LockWidgetComponent;
  }

  public show(modalOptions: ModalOptions = {}, params?: object): Observable<NzSafeAny> {
    return this.modalWrapService.show(this.getContentComponent(), modalOptions, params);
  }
}
