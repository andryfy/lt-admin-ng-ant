import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Dept } from '@http/system/dept.service';
import { ModalWrapService } from '@widgets/base-modal';
import { DeptManageModalComponent } from '@widgets/biz-widget/system/dept-manage-modal/dept-manage-modal.component';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { ModalOptions } from 'ng-zorro-antd/modal';

@Injectable({
  providedIn: 'root'
})
export class DeptManageModalService {
  constructor(private modalWrapService: ModalWrapService) {}
  protected getContentComponent(): NzSafeAny {
    return DeptManageModalComponent;
  }

  public show(modalOptions: ModalOptions = {}, modalData?: Dept): Observable<NzSafeAny> {
    return this.modalWrapService.show<Dept>(this.getContentComponent(), modalOptions, modalData);
  }
}
