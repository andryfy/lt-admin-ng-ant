import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

/**
 * Service used to store whether the dialog box is in full-screen state
 * Even if multiple dialog boxes are opened, only one full-screen dialog box can exist at the same time.
 *
 */
@Injectable({
  providedIn: 'root'
})
export class ModalFullStatusStoreService {
  private modalFullStatusStore$ = new BehaviorSubject<boolean>(false);

  constructor() {}

  setModalFullStatusStore(store: boolean): void {
    this.modalFullStatusStore$.next(store);
  }

  getModalFullStatusStore(): Observable<boolean> {
    return this.modalFullStatusStore$.asObservable();
  }
}
