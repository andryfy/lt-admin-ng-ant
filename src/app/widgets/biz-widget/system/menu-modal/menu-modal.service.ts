import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { MenuOption } from '@app/core/services/http/system/menu.service';
import { ModalWrapService } from '@widgets/base-modal';
import { MenuModalComponent } from '@widgets/biz-widget/system/menu-modal/menu-modal.component';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { ModalOptions } from 'ng-zorro-antd/modal';

@Injectable({
  providedIn: 'root'
})
export class MenuModalService {
  constructor(private modalWrapService: ModalWrapService) {}
  protected getContentComponent(): NzSafeAny {
    return MenuModalComponent;
  }

  public show(modalOptions: ModalOptions = {}, modalData?: MenuOption): Observable<NzSafeAny> {
    return this.modalWrapService.show(this.getContentComponent(), modalOptions, modalData);
  }
}
